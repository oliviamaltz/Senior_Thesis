PennController.ResetPrefix(null)
var showProgressBar = false;
DebugOff()

const assetsurl = "https://github.com/yjunechoe/test-recordings/releases/download/draft2/"

Sequence("intro", "instructions", "practice", "counter", "critical", SendResults(), "bye")
SetCounter("counter", "inc", 1)

// https://farm.pcibex.net/p/NchzOp/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
Header()
    .log( "PROLIFIC_PID" , GetURLParameter("PROLIFIC_PID") )
    .log( "STUDY_ID", GetURLParameter("STUDY_ID") )
    .log( "SESSION_ID", GetURLParameter("SESSION_ID") )

newTrial( "intro" ,
    newText("<p style=font-size:18px;>Welcome to our study!</p>" +
            "<p style=font-size:18px;>Press Enter to go full screen and begin!:</p>")
        .center()  
        .print()
    ,
    newTextInput("inputID","Please enter your ID here.")
        .center()
        .print()
    ,
    getTextInput("inputID")
        .wait() 
        .log()
    ,
    newKey("Enter","ENTER")
        .wait()
    ,
    fullscreen()
)

newTrial("instructions",
    newKey(" ").wait()
    ,
    newImage("sally", assetsurl + "headshot_f.jpg")
        .css({"width": "300px"})
    ,
    newImage("bob", assetsurl + "headshot_m.jpg")
        .css({"width": "300px"})
    ,
    newCanvas("headshots", 500, 400)
        .cssContainer({
            "margin-bottom": "50px"
        })
        .center()
        .print()
    ,
    getKey(" ").wait()
    ,
    getCanvas("headshots")
        .add("center at 0%", "middle at 50%", getImage("sally"))
    ,
    newAudio("hi-sally", assetsurl + "hi_sally.wav")
        .play()
        .wait()
    ,
    getKey(" ").wait()
    ,
    getCanvas("headshots")
        .add("center at 100%", "middle at 50%", getImage("bob"))
    ,
    newAudio("hi-bob", assetsurl + "hi_bob.wav")
        .play()
        .wait()
    ,
    getKey(" ").wait()
)

newTrial("instructions",
    newKey(" ").wait()
    ,
    newImage("sally", assetsurl + "headshot_f.jpg")
        .css({"width": "300px"})
    ,
    newImage("bob", assetsurl + "headshot_m.jpg")
        .css({"width": "300px"})
    ,
    newCanvas("headshots", 500, 500)
        .center()
        .add("center at 0%", "middle at 50%", getImage("sally"))
        .add("center at 100%", "middle at 50%", getImage("bob"))
        .print()
    ,
    getKey(" ").wait()
)

newTrial("practice",
    newText("practice-absent", `<video src="${assetsurl}practice_absent.mp4" controls></video>`)
        .center()
        .print()
    ,
    newKey(" ").wait()
    ,
    getText("practice-absent")
        .remove()
    ,
    newText("practice-present", `<video src="${assetsurl}practice_present.mp4" controls></video>`)
        .center()
        .print()
    ,
    getKey(" ").wait()
    ,
    getText("practice-present")
        .remove()
    ,
    newImage("table", assetsurl + "empty_table.jpg")
        .css({
            "width": "1000px",
            "margin-top": "50px"
        })
        .center()
        .print()
    ,
    getKey(" ").wait()
)

const findAllIndices = (arr, regex) => arr.reduce((indices, element, index) => regex.test(element) ? [...indices, index] : indices, []);
function item_to_testset(x) {
    var vec = ["-sub-1.jpg", "-sub-2.jpg", "-basic-1.jpg", "-basic-2.jpg", "-other-1.jpg"]
    vec = vec.map(end => x + end).sort(() => Math.random() - 0.5)
    return [x + "-other-2.jpg"].concat(vec)
}

const url = "https://raw.githubusercontent.com/yjunechoe/test-recordings/main/"
const ext = ".mp4"

const criticalTrial = function(row) {
    
    const testset = item_to_testset(row.item).map(x => url + x)
    const cond = row.cond
    const word = row.word
    const item = row.item
    
    // Base frame name
    const baseFrame = assetsurl + item + "_" + word + "_"
    
    // Create a default image with common properties
    defaultImage
        .css("width", "1200px")
        .center()
    
    return newTrial("critical",
        // Display first frame
        newImage("frame1", baseFrame + "start.jpg")
            .center()
            .print()
        ,
        newTimer("frame-timer", 2000).start().wait()
        ,
        // "Look here! I see three cards! Do you see the cards?"
        newAudio("frame1-audio", assetsurl + "audio_start.wav")
            .play()
            .wait()
        ,
        ...[
            getTimer("frame-timer").start().wait(),
            // one: "I'm gonna hide them!"
            cond == "one" ? 
            newAudio("frame1-audio2", assetsurl + "audio_hide.wav")
                .play()
                .wait()
            : null
        ]
        ,
        getTimer("frame-timer").start().wait()
        ,
        getImage("frame1").remove()
        ,
        // Display second frame
        newImage("frame2", baseFrame + cond + ".jpg")
            .size(defaultImage.size())
            .center()
            .print()
        ,
        // "Ooh, (a) nice card(s)"
        newAudio("frame2-audio", assetsurl + `nice_card_${cond}.wav`)
            .play()
            .wait()
        ,
        newTimer("frame2-timer", 4000).start().wait()
        ,
        getImage("frame2").remove()
        ,
        // Display third frame
        newImage("frame3", baseFrame + "end.jpg")
            .size(defaultImage.size())
            .center()
            .print()
        ,
        // "See? This is a mipen! Do you see the mipen? Help me find more mipens!"
        newAudio("frame3-audio", assetsurl + `label_${word}.wav`)
            .play()
            .wait()
        ,
        getTimer("frame-timer").start().wait()
        ,
        getImage("frame3").remove()
        ,
        newFunction("set-emoji-cursor", cursorOn)
            .call()
        ,
        // test phase
        newSelectionGrid("test-phase", testset)
            .css({"margin-top": "200px"})
            .center()
            .show()
            .print()
            .log()
        ,
        newButton("Done")
            .cssContainer("margin", "1rem")
            .css("font-size", "24px")
            .print()
            .center()
            .wait()
            // .wait(getSelectionGrid("test-phase").test.selectAny())
        ,
        newFunction("remove-emoji-cursor", cursorOff)
            .call()
    )
    .log("group", row.group)
    .log("item", item)
    .log("cond", cond)
}

Template(
    GetTable("template.csv")
    //    .filter(row => row.word == "mipen")
    ,
    row => criticalTrial(row)
)

newTrial( "bye" ,
    newText("Results saved.")
        .center()
        .print()
    ,
    newButton("empty")
        .print()
        .hidden()
        .wait()
)



// Define the cursor functions
const cursorOn = () => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.textContent = '👆';
    cursor.style.position = 'fixed';
    cursor.style.fontSize = '120px';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.id = 'emoji-cursor'; // Add ID for easy removal
    document.body.appendChild(cursor);
    
    // Make cursor follow mouse
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
};

const cursorOff = () => {
    // Remove custom cursor and event handler
    const cursor = document.getElementById('emoji-cursor');
    if (cursor) {
        cursor.parentNode.removeChild(cursor);
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', (e) => {});
    
    // Restore default cursor
    document.body.style.cursor = 'auto';
};
