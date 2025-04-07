PennController.ResetPrefix(null)

const asseturl = "https://github.com/oliviamaltz/senior_thesis/releases/download/files/"

Sequence(
    "consent",
    "fullscreen",
    "instructions",
    "practice",
    "counter",
    rshuffle(randomize("critical"), randomize("filler")),
    SendResults()
)
SetCounter("counter", "inc", 1)

defaultText
    .css({
        "font-size": "24px",
        "line-height": "1.3",
        "text-align": "center"
    })
    .center()

defaultButton
    .css({
        "margin": "20px 0px",
        "font-size": "18px"
    })
    .center()

defaultTextInput
    .css({
        "font-size": "18px",
        width: "600px",
        "height": "50px"
    })
    .center()

newTrial("consent",
    newHtml("consent", "consent.html")
        .cssContainer("margin", "0% 10%")
        .print()
    ,
    newButton("consent button", "I agree to participate")
        .cssContainer("margin-top", "2rem")
        .cssContainer("margin-bottom", "1rem")
        .css("font-size", "1.2em")
        .center()
        .print()
        .wait()
)
newTrial("fullscreen",
    newText("<p style=font-size:18px;>Welcome to our study!</p>" +
            "<p style=font-size:18px;>Press Enter to go full screen and begin!:</p>")
        .center()  
        .print()
    ,
    newKey("Enter","ENTER")
        .wait()
    ,
    fullscreen()
)

newTrial("instructions",
    newImage("cat", asseturl + "cat.png")
        .css({
            "margin-bottom": "30px",
            "outline": "5px solid grey"
        })
        .center()
        .size(300)
        .print()
        .hidden()
    ,
    newText("inst", "Welcome!")
        .css({
            "font-size": "1.5em",
            "line-height": "1.5",
        })
        .center()
        .print()
    ,
    newText("press-space", "Press the space bar to continue")
        .css({
            "font-size": "1.2em",
            "font-style": "italic",
            "margin-top": "2em",
            "animation": "blink 2s infinite",
        })
        .center()
        .print()
    ,
    newKey("space", " ").wait()
    ,
    getText("inst").text("In this task, you're going help a friend decode some alien words!")
    ,
    getKey("space").wait()
    ,
    getImage("cat").visible()
    ,
    getText("inst").text("This is Anne and she want to call her alien friends who live on a different planet.<br>Her friends speak a language that sounds like English but has some words that are different.")
    ,
    getKey("space").wait()
    ,
    getText("inst").text("Sometimes the phone call has a bad connection, so Anne does not hear everything her her friend says on the phone.<br>We are going to help her guess the meaning of slien words she does not know.<br>She will give you two options, so pay attention!")
    ,
    getKey("space").wait()
    ,
    getText("inst").text("Are you ready?<br><strong>Turn up the volume</strong> and press the spacebar to begin!")
    ,
    newKey(" ").wait()
)

const criticalTrial = function(row) {

    const number = row.plural == "TRUE" ? "pl" : "sg"
    const superordinate = row.super
    const basic = row.basic
    const first = row.cat_first_answer

    if (first == "super") {
        audio_first = `${superordinate}_${number}.wav`
        audio_second = `${basic}_${number}.wav`
    } else {
        audio_first = `${basic}_${number}.wav`
        audio_second = `${superordinate}_${number}.wav`
    }

    alien_id = 1

    return newTrial("critical",
        // scene setup
        newImage("alien", asseturl + `alien${alien_id}.png`)
            .css({height: "300px"})
        ,
        newImage("cat", asseturl + "cat.png")
            .css({height: "300px"})
        ,
        newCanvas("alien-cat-canvas", 500, 400)
            .center()
            .add("center at 0%", "middle at 50%", getImage("alien"))
            .add("center at 100%", "middle at 50%", getImage("cat"))
            .print()
        ,
        newText(row.item)
            .center()
            .print()
        ,
        newKey(" ").wait()
        ,
        // alien says frame
        getImage("alien")
            .css({"animation": "jitter 1s infinite"})
        ,
        newAudio("alien-says", asseturl + row.alien_frame_audio)
            .play()
            .wait()
        ,
        getImage("alien")
            .css({"animation": "none"})
        ,
        getKey(" ").wait()
        ,
        // cat says choices
        getImage("cat")
            .css({"animation": "jitter 1s infinite"})
        ,
        newAudio("cat-says-first", asseturl + audio_first)
            .play()
            .wait()
        ,
        newAudio("cat-says-second", asseturl + audio_second)
            .play()
            .wait()
        ,
        getImage("cat")
            .css({"animation": "none"})
        ,
        getKey(" ").wait()
        ,
        // ADULTS: input text
        newTextInput("response")
            .center()
            .lines(1)
            .size(500, 60)
            .css({
                "font-size": "30px" 
            })
            .cssContainer({
                "margin": "2em 0"
            })
            .print()
            .log()
        ,
        // CHILDREN: select choices
        // newText("super", row.super + " " + number).print()
        // ,
        // newText("basic", row.basic + " " + number).print()
        // ,
        // newCanvas("selection-canvas", 500, 100)
        //     .center()
        //     .add("center at 25%", "middle at 50%", getText("super"))
        //     .add("center at 75%", "middle at 50%", getText("basic"))
        //     .print()
        // ,
        // newSelector("choice")
        //     .add( getText("super") , getText("basic") )
        //     .print()
        //     .frame("dashed 3px green")
        //     .log()
        // ,
        newButton("continue")
            .center()
            .print()
            .wait()
    )
        .log("split", row.split)
        .log("type", row.type)
        .log("list", row.list)
        .log("item", row.item)
        .log("plural", row.plural)
        .log("super", row.super)
        .log("basic", row.basic)
        .log("cat_first_answer", row.cat_first_answer)

}

Template(
    GetTable("template.csv")
        // .filter(row => row.type == "critical4" && row.list == "list2" && row.item == "Vegetable")
    ,
    row => criticalTrial(row)
)

const nonCriticalTrial = function(row, label) {
    
    return newTrial(label,
        // scene setup
        newImage("alien", asseturl + "alien_practice.png")
            .css({height: "300px"})
        ,
        newImage("cat", asseturl + "cat.png")
            .css({height: "300px"})
        ,
        newCanvas("alien-cat-canvas", 500, 400)
            .center()
            .add("center at 0%", "middle at 50%", getImage("alien"))
            .add("center at 100%", "middle at 50%", getImage("cat"))
            .print()
        ,
        newText(row.item)
            .center()
            .print()
        ,
        newKey(" ").wait()
        ,
        // alien says frame
        getImage("alien")
            .css({"animation": "jitter 1s infinite"})
        ,
        newAudio("alien-says", asseturl + row.alien_frame_audio)
            .play()
            .wait()
        ,
        getImage("alien")
            .css({"animation": "none"})
        ,
        getKey(" ").wait()
        ,
        // cat says choices
        getImage("cat")
            .css({"animation": "jitter 1s infinite"})
        ,
        newAudio("cat-says", asseturl + row.item + "_cat.wav")
            .play()
            .wait()
        ,
        getImage("cat")
            .css({"animation": "none"})
        ,
        getKey(" ").wait()
        ,
        // ADULTS: input text
        newTextInput("response")
            .center()
            .lines(1)
            .size(500, 60)
            .css({
                "font-size": "30px" 
            })
            .cssContainer({
                "margin": "2em 0"
            })
            .print()
            .log()
        ,
        // CHILDREN: select choices
        // newText("correct", row.correct).print()
        // ,
        // newText("incorrect", row.incorrect).print()
        // ,
        // newCanvas("selection-canvas", 500, 100)
        //     .center()
        //     .add("center at 25%", "middle at 50%", getText("correct"))
        //     .add("center at 75%", "middle at 50%", getText("incorrect"))
        //     .print()
        // ,
        // newSelector("choice")
        //     .add( getText("correct") , getText("incorrect") )
        //     .print()
        //     .frame("dashed 3px green")
        //     .log()
        // ,
        newButton("continue")
            .center()
            .print()
            .wait()
    )
        .log("type", row.type)
        .log("item", row.item)
        .log("correct", row.correct)
        .log("incorrect", row.incorrect)
        .log("cat_first_answer", row.cat_first_answer)

}

// practice trials
Template(
    GetTable("template_practice.csv")
        //.filter(row => row.item == "practice1")
    ,
    row => nonCriticalTrial(row, label = "practice")
)

// filler trials
Template(
    GetTable("template_filler.csv")
        //.filter(row => row.item == "practice1")
    ,
    row => nonCriticalTrial(row, label = "filler")
)
