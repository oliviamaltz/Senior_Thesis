PennController.ResetPrefix(null)

const asseturl = "https://github.com/oliviamaltz/senior_thesis/releases/download/files/"

Sequence("practice", "critical", "counter", SendResults())
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
        // select choices
        newText("super", row.super + " " + number).print()
        ,
        newText("basic", row.basic + " " + number).print()
        ,
        newCanvas("selection-canvas", 500, 100)
            .center()
            .add("center at 25%", "middle at 50%", getText("super"))
            .add("center at 75%", "middle at 50%", getText("basic"))
            .print()
        ,
        newSelector("choice")
            .add( getText("super") , getText("basic") )
            .print()
            .frame("dashed 3px green")
            .log()
        ,
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
        .filter(row => row.type == "critical4" && row.list == "list2" && row.item == "Vegetable")
    ,
    row => criticalTrial(row)
)

const practiceTrial = function(row) {
    
    return newTrial("practice",
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
        // select choices
        newText("correct", row.correct).print()
        ,
        newText("incorrect", row.incorrect).print()
        ,
        newCanvas("selection-canvas", 500, 100)
            .center()
            .add("center at 25%", "middle at 50%", getText("correct"))
            .add("center at 75%", "middle at 50%", getText("incorrect"))
            .print()
        ,
        newSelector("choice")
            .add( getText("correct") , getText("incorrect") )
            .print()
            .frame("dashed 3px green")
            .log()
        ,
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

Template(
    GetTable("template_practice.csv")
        //.filter(row => row.item == "practice1")
    ,
    row => practiceTrial(row)
)
