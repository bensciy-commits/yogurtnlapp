import { GoogleGenAI, Type } from "@google/genai";
import { ScriptIdea, UILibrary, Difficulty } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LIBRARY_IMPORTS: Record<UILibrary, string> = {
  [UILibrary.Rayfield]: `getgenv().SecureMode = true
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()`,
  [UILibrary.Fluent]: `local Fluent = loadstring(game:HttpGet("https://github.com/dawid-scripts/Fluent/releases/latest/download/main.lua"))()`,
  [UILibrary.Solaris]: `local SolarisLib = loadstring(game:HttpGet("https://raw.githubusercontent.com/BloodBall/Solaris-Lib/main/SolarisLib.lua"))()`,
  [UILibrary.Orion]: `local OrionLib = loadstring(game:HttpGet(('https://raw.githubusercontent.com/shlexware/Orion/main/source')))()`,
  [UILibrary.Kavo]: `local Kavo = loadstring(game:HttpGet("https://raw.githubusercontent.com/xHeptc/Kavo-UI-Library/main/source.lua"))()`,
};

// Syntax guides to prevent "Empty GUI" errors
const LIBRARY_SYNTAX: Record<UILibrary, string> = {
  [UILibrary.Rayfield]: `
    -- RAYFIELD SYNTAX GUIDE (DO NOT HALLUCINATE)
    local Window = Rayfield:CreateWindow({Name = "GenAI Hub", LoadingTitle = "GenAI", Configuration = {Saving = {Enabled = false}}})
    local Tab = Window:CreateTab("Main", 4483362458) -- Title, IconID
    local Section = Tab:CreateSection("Features")
    
    -- Toggle
    Tab:CreateToggle({
       Name = "Toggle Name",
       CurrentValue = false,
       Flag = "Toggle1", 
       Callback = function(Value)
          getgenv().FeatureEnabled = Value
          if Value then task.spawn(function() while getgenv().FeatureEnabled do task.wait() end end) end
       end
    })
    
    -- Button
    Tab:CreateButton({
       Name = "Button Name",
       Callback = function()
          print("Clicked")
       end
    })
    
    -- Slider
    Tab:CreateSlider({
       Name = "Slider Name",
       Range = {0, 100},
       Increment = 1,
       Suffix = "Value",
       CurrentValue = 10,
       Flag = "Slider1", 
       Callback = function(Value)
          print(Value)
       end
    })
  `,
  [UILibrary.Fluent]: `
    -- FLUENT SYNTAX GUIDE (DO NOT HALLUCINATE)
    local Window = Fluent:CreateWindow({Title = "GenAI Hub", SubTitle = "by Gemini", TabWidth = 160, Size = UDim2.fromOffset(580, 460), Theme = "Dark", MinimizeKey = Enum.KeyCode.LeftControl})
    local Tab = Window:AddTab({ Title = "Main", Icon = "" })
    
    -- Toggle
    local Toggle = Tab:AddToggle("MyToggle", {Title = "Toggle Name", Default = false})
    Toggle:OnChanged(function()
        getgenv().FeatureEnabled = Toggle.Value
        if Toggle.Value then task.spawn(function() while getgenv().FeatureEnabled do task.wait() end end) end
    end)
    
    -- Button
    Tab:AddButton({
        Title = "Button Name",
        Callback = function()
            print("Clicked")
        end
    })
    
    -- Slider
    local Slider = Tab:AddSlider("MySlider", {
        Title = "Slider Name",
        Description = "Optional description",
        Default = 16,
        Min = 0,
        Max = 100,
        Rounding = 1,
        Callback = function(Value)
            print(Value)
        end
    })
  `,
  [UILibrary.Solaris]: "", [UILibrary.Orion]: "", [UILibrary.Kavo]: "" // Fallbacks
};

/**
 * Uses Gemini 2.5 Flash for fast JSON generation of ideas
 */
export const brainstormScriptIdeas = async (gameName: string): Promise<ScriptIdea[]> => {
  try {
    const prompt = `Generate 10 distinct and advanced Roblox script feature ideas for the game "${gameName}".
    
    The user wants a "Script Hub" style output (like Rayfield/Fluent).
    
    STRICT FORMATTING RULES:
    1. **Title**: MUST be a single generic category word.
       - ALLOWED: "Vision", "Trolling", "Combat", "Movement", "Automation", "World".
       - BANNED: "${gameName}", "Script", "Hack", "MM2", "Blox Fruits".
    
    2. **Description**: MUST be a concise list of features within that category.
       - Do not use sentences.
       - List specific mechanics.
    
    Examples for style matching:
    
    Game: "Murder Mystery 2"
    Idea 1:
    - Title: "Vision"
    - Description: "ESP Murderer, ESP Sheriff, ESP Innocent, ESP Gun (If Drop), Tracers, Box ESP."
    Idea 2:
    - Title: "Trolling"
    - Description: "Fling Player, Fling All, Fling Murderer, Fling Sheriff, Fling Random Player, Spinbot."
    Idea 3:
    - Title: "Auto Kill All"
    - Description: "(Only Murder) Auto Aim, (Only Sheriff) Auto Grab Gun, Kill Aura, Silent Aim."

    Game: "Blox Fruits"
    Idea 1:
    - Title: "Automation"
    - Description: "Auto Farm Level, Auto Collect Fruit, Auto Stats, Auto Raid."
    
    Generate 10 ideas for "${gameName}" following this exact pattern.
    Include "Insane" difficulty for overpowered features (Crashers, Admin).
    
    Return exactly 10 ideas.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard", "Insane"] },
            },
            required: ["title", "description", "difficulty"],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as ScriptIdea[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Error brainstorming ideas:", error);
    throw new Error("Failed to generate ideas. Please try again.");
  }
};

/**
 * Uses Gemini 3 Pro for high-quality coding tasks
 */
export const generateLuaScript = async (
  gameName: string,
  idea: ScriptIdea,
  library: UILibrary,
  includeUniversalKit: boolean = false,
  themeColor: string = 'Violet'
): Promise<string> => {
  try {
    const importCode = LIBRARY_IMPORTS[library] || LIBRARY_IMPORTS[UILibrary.Rayfield];
    const syntaxGuide = LIBRARY_SYNTAX[library] || LIBRARY_SYNTAX[UILibrary.Rayfield];

    const themeConfig = `
    ### THEME CONFIGURATION
    The user selected the color: **${themeColor}**.
    - **Rayfield**: Set 'Configuration.Theme' to a value matching ${themeColor} (e.g., 'Amethyst' for Violet, 'Light' for White, 'Amber' for Orange, 'Green', 'Red', 'DarkBlue').
    - **Fluent**: Configure the Window 'Theme' or 'MainColor' options to match **${themeColor}**.
    `;

    // Specific logic for Murder Mystery 2
    const mm2Context = (gameName.toLowerCase().includes("murder mystery 2") || gameName.toLowerCase().includes("mm2"))
      ? `\n\n### SPECIFIC GAME LOGIC: MURDER MYSTERY 2
         - **ESP Requirement**: You MUST detect roles by scanning every Player's 'Backpack' and 'Character' for a Tool named "Knife" (Murderer) or "Gun" (Sheriff).
         - **Auto Coins (CRITICAL FIX)**: The coins are NOT in a fixed folder. They are inside the ACTIVE MAP folder (e.g., workspace.Bank2.CoinAreas). You MUST iterate 'workspace:GetChildren()' to find the active map, BUT DO THIS ONCE per round, not every frame.
         - **Kill Aura**: If LocalPlayer is Murderer (has Knife), loop through players < 15 studs. If found, activate the Knife tool.`
      : "";
      
    // Specific logic for DOORS
    const doorsContext = (gameName.toLowerCase().includes("doors"))
      ? `\n\n### SPECIFIC GAME LOGIC: DOORS
         - **UI STYLING**: 
           - For the ESP/Visuals tab/section, use an **Eye** icon (e.g. 'lucide-eye', 'rbxassetid://4483362458' or similar).
           - For Movement, use a **Human/Walking** icon (e.g. 'lucide-footprints', 'rbxassetid://...').
         
         - **ESP PERFORMANCE (CRITICAL)**:
           - **Scope**: ONLY scan 'workspace.CurrentRooms'. Do NOT scan the entire workspace.
           - **Caching**: Use 'workspace.CurrentRooms.DescendantAdded:Connect()' to add items to ESP tables. Do NOT loop descendants every frame.
         
         - **ESP TARGETS**:
           - **Items**: Key, Lighter, Flashlight, Vitamins, Crucifix, Bandage.
           - **Loot**: "Chest" (Box), "Drawer" (if containing items).
           - **Objectives**: "Book", "BreakerSwitch", "Lever", "Key", "Gate", "Door".
           - **Hiding Spots**: Highlight "Wardrobe" and "Closet" models (useful for hiding from Rush).
           - **Entities**: Red Highlight for "RushMoving", "AmbushMoving", "Eyes", "Screech", "Seek".
         
         - **AUTO LOOT AURA**:
           - Loop nearby descendants of CurrentRooms (Radius < 14).
           - If Name is "Gold" or an Item AND has a ProximityPrompt, fire it automatically.
           
         - **LIBRARY SOLVER**:
           - Highlight all "Book" models in the library. If possible, display the "Hint" code on screen (ScreenGui TextLabel).
           
         - **ANTI-ENTITY**:
           - Destroy "Spider" (Timothy) and "Screech" on ChildAdded.
           
         - **MOVEMENT**:
           - Speed Slider (16-25), Noclip (Toggle via Stepped loop on Character), Fly (G keybind).`
      : "";
      
    // Specific logic for THE GLASS BRIDGE
    const glassBridgeContext = (gameName.toLowerCase().includes("glass bridge"))
      ? `\n\n### SPECIFIC GAME LOGIC: THE GLASS BRIDGE
         - **REQUIRED UI**: You MUST create a Toggle named "Highlight Safe Path".
         - **Implementation Logic**:
           1. Listen to 'workspace.DescendantAdded' or 'ChildAdded'.
           2. When scanning, verify the Object Name is "Step".
           3. If it is a "Step":
              - Find child "glass_tempered" -> Apply GREEN Highlight (FillColor = Color3.fromRGB(0,255,0)).
              - Find child "glass_weak" -> Apply RED Highlight (FillColor = Color3.fromRGB(255,0,0)).
         - **Important**: The "Step" might be in a folder. Use 'workspace:GetDescendants()' once on enable, then listen for new steps.`
      : "";

    // Detailed implementation instructions for the Universal Kit to ensure it works
    const kitContext = includeUniversalKit 
      ? `\n\n### UNIVERSAL KIT REQUIREMENT (CRITICAL)
         You MUST Create a NEW Tab called "Universal" or "OP Settings".
         Inside this tab, add these WORKING features using standard Roblox services:
         
         1. **Toggle: Noclip**
            - Use 'RunService.Stepped' connection.
            - Loop through LocalPlayer.Character:GetDescendants().
            - If part is BasePart, set CanCollide = false.
            
         2. **Toggle: Fly**
            - Do NOT use simple BodyVelocity. Use a loop that sets HumanoidRootPart.CFrame based on Camera CFrame.
            - Include keybinds (W,A,S,D, Space, Shift).
            
         3. **Toggle: Infinite Jump**
            - Connect to 'UserInputService.JumpRequest'.
            - Set Humanoid:ChangeState(Enum.HumanoidStateType.Jumping).
            
         4. **Slider: WalkSpeed**
            - Range: 16 to 500.
            - IMPORTANT: Use 'Humanoid:GetPropertyChangedSignal("WalkSpeed")' to force the speed back if the game tries to reset it.
            
         5. **Button: Fling All (FIXED LOGIC)**
            - Logic: Loop through all players.
            - For each target:
              - Set LocalPlayer.HumanoidRootPart.CFrame to target.HumanoidRootPart.CFrame.
              - Apply a 'BodyAngularVelocity' with MaxTorque = Vector3.new(math.huge,math.huge,math.huge) and AngularVelocity = Vector3.new(0,10000,0).
              - Wait 0.1s, then remove velocity and move to next player.
            - Ensure GodMode/Noclip is active during fling to avoid dying.
            
         6. **Input & Button: Fling Target**
            - Accept a username string (partial match).
            - Apply the same 'BodyAngularVelocity' logic to that specific player continuously until toggled off or button logic finishes.
            
         7. **Toggle: FullBright**
            - Lighting.Brightness = 2, Lighting.ClockTime = 14, Lighting.GlobalShadows = false.
         ` 
      : "";

    const prompt = `You are an elite Roblox Lua Scripter. Write a ROBUST, CRASH-PROOF LocalScript for "${gameName}".
    
    ### CRITICAL: DEBUGGING & FEEDBACK (FIX "SCRIPT NOT WORKING")
    1. **Wait For Game**: Start with 'repeat task.wait() until game:IsLoaded()' to ensure the game is ready.
    2. **Load Notification**: IMMEDIATELY after loading the Library, call the Library's Notify function (e.g., Fluent:Notify or Rayfield:Notify) with Title="Script Loaded" and Content="Enjoy your script!". This confirms to the user that the code is running.
    3. **Anti-AFK**: Include a simple Anti-AFK script at the bottom: 'game:GetService("VirtualUser"):CaptureController()'.
    4. **Safety Checks**: 
       - NEVER index 'workspace' directly for dynamic folders. Use 'workspace:WaitForChild("FolderName", 5)'.
       - Always check 'if LocalPlayer.Character then' before accessing Character parts.
    5. **Thread Safety**: Wrap infinite loops (while true do) inside 'task.spawn(function() ... end)' so they do not freeze the UI.

    ### CRITICAL: UI GENERATION RULES (FIX "EMPTY GUI")
    1. **ALWAYS Create Elements**: You MUST create actual UI elements (Buttons, Toggles, Sliders) inside the Tab. Do not just write standalone logic code.
    2. **Mapping Rules**:
       - "ESP", "Auto", "Loop", "Aura" -> MUST be a **Toggle**.
       - "Teleport", "Get", "Give", "Kill" -> MUST be a **Button**.
       - "Speed", "Height", "Distance" -> MUST be a **Slider**.
    3. **Syntax Guide**: Use the following syntax for the selected library:
    ${syntaxGuide}

    ### CONFIGURATION
    - **Library**: ${library}
    - **Feature Category**: ${idea.title}
    - **Specific Features**: ${idea.description}
    - **Difficulty**: ${idea.difficulty}

    ${themeConfig}

    ### PERFORMANCE & FPS OPTIMIZATION
    The user reported LOW FPS. You MUST optimize the ESP logic:
    1. **NO Heavy Loops in RenderStepped**: NEVER loop through 'workspace:GetDescendants()' or 'GetChildren()' inside a 'RunService.RenderStepped' loop. This causes massive lag.
    2. **Event-Based Caching**: 
       - Create a table 'local ValidTargets = {}'.
       - Listen to 'workspace.DescendantAdded' (or specific folder events like 'CurrentRooms.DescendantAdded') to insert valid items into 'ValidTargets'.
       - Listen to 'workspace.DescendantRemoving' to remove them.
       - In 'RenderStepped', ONLY iterate through the 'ValidTargets' table to update positions/highlights.
    3. **Instance Reuse**: Use 'Highlight' instances (Adornee = model) instead of manual Line/Box drawing if possible, as Roblox optimizes Highlights natively. Do not create new Instances every frame.
    4. **Distance Checks**: Only render ESP if 'LocalPlayer:DistanceFromCharacter(target) < 2000' (or appropriate range).

    ### CODE STRUCTURE REQUIREMENTS
    1. **Imports & Services**: 
       - Start with 'local Players = game:GetService("Players")'
       - 'local RunService = game:GetService("RunService")'
       - 'local UserInputService = game:GetService("UserInputService")'
       - 'local LocalPlayer = Players.LocalPlayer'
       - THEN include the library loadstring:
       ${importCode}
       
    2. **Window Creation**: Initialize the Window/Hub using the official ${library} syntax. 
       - Title: "GenAI | ${gameName}"
    
    3. **Tabs**: 
       - Create a Tab named "${idea.title}".
       - Implement the "Specific Features" listed above inside this tab using Toggles/Buttons.
       - USE 'pcall' for risky operations.
       
    ${mm2Context}
    ${doorsContext}
    ${glassBridgeContext}
    ${kitContext}

    4. **Safety & Persistence (CRITICAL)**: 
       - **Respawn Safety**: If a feature (like Fly, Speed, ESP) is enabled, it MUST automatically re-enable after the LocalPlayer respawns.
       - **Cleanup**: Ensure old connections are cleaned up.

    ### OUTPUT RULES
    - Output ONLY raw Lua code. 
    - NO markdown backticks (e.g. \`\`\`lua). 
    - NO explanation text. 
    - The code must be copy-paste ready.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Best for coding
      contents: prompt,
    });

    let code = response.text || "-- Failed to generate code.";
    
    // Aggressive cleanup to ensure copy-paste works
    code = code.replace(/^```lua\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    return code;
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate the script. Please check your API limits.");
  }
};