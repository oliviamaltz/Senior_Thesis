window.PennController._AddElementType("SelectionGrid", function(PennEngine) {
    
    this.immediate = function(id, imageString, endpoint = "", dim = [1, 6]){
        
        this.id = id;
        this.dim = dim;
        
        // image properties
        this.imgPathArray = typeof imageString == "string" ? JSON.parse(imageString) : imageString;
        
        // console.log(this.imgPathArray)
        
        // preload images
        this.imgArray = this.imgPathArray.slice().map(d => {
            let imgObj = new Image();
            imgObj.src = endpoint + d;
            return imgObj;
        })
        
        // selections
        this.selection = new Set()
        // [img, click type, time]
        this.clickEvent = [];
    }
        
    // render
    this.uponCreation = function(resolve){

        that = this;
        // define grid
        // append images
        //
        this.jQueryElement = $("<div>")
          .attr("class", "PennController-SelectionGrid")
          .css({
            "grid-template-rows": `repeat(${this.dim[0]}, 200px)`,
            "grid-template-columns": `repeat(${this.dim[1]}, 200px)`
          })
        
        this.imgArray.forEach((img) => {
            let imgfile = img.src.match("[a-z0-9\-_]+\.[a-zA-Z]+$")[0]
            this.jQueryElement
                .append(
                    $("<div class='PennController-cell'>")
                        .append(
                            $(img).attr("img-file", imgfile)
                        )
                        .click(function() {
                            let cell = $(this)
                            if (cell.hasClass("PennController-cell-selected")) {
                                cell.removeClass("PennController-cell-selected")
                                that.selection.delete(imgfile)
                            } else {
                                cell.addClass("PennController-cell-selected")
                                that.selection.add(imgfile)
                            }
                            let clickEventType = cell.hasClass("PennController-cell-selected")
                            let clickEventTime = Date.now() - that.startTime
                            that.clickEvent.push([imgfile, clickEventType, clickEventTime].join(";"))
                            console.log(that.clickEvent)
                        })
                )
        })
        
        resolve();

    };
    
    this.end = function(){
        // log
        if (this.log){
            let trialResult = Array.from(that.selection).join(";") + "|" + that.clickEvent.join(":")
            console.log(trialResult)
            PennEngine.controllers.running.save(this.type, this.id, "Selections", trialResult, this.printTime, "NULL")
        }
        // remove all elements from selection set
        that.selection.clear()
        
    };

    this.test = {
        // test for any
        selectAny: function() {
			if (that.selection.size === 0) {
			    alert("Please make a selection.")
			}
            return that.selection.size > 0
        }
    };
    
    // display none so imgs load during test but doesn't takeup space
    this.actions = {
        hide: function(resolve){
            // console.log("SelectionGrid hidden")
            this.jQueryElement.css("display", "none")
            resolve();
        },
        show: function(resolve){
            // console.log("SelectionGrid shown")
            this.jQueryElement.css("display", "grid")
            this.startTime = Date.now()
            resolve();
        }
    }

})
