window.PennController._AddElementType("SelectionArray", function(PennEngine) {
    
    this.immediate = function(id, imageString){
        
        this.id = id;
        
        // image properties
        this.imgPathArray = typeof imageString == "string" ? JSON.parse(imageString) : imageString;
        
        // preload images
        this.imgArray = this.imgPathArray.slice().map(d => {
            let imgObj = new Image();
            imgObj.src = d;
            return imgObj;
        })
        // reverse because cards are FIFO
        this.imgArray.reverse()
        
        // selections
        this.selections = [];
        // [img, click type, time]
        this.times = [];
    }
        
    // render
    this.uponCreation = function(resolve){
        
        this.completed = false;

        that = this;
        // define grid
        // append images
        //
        this.jQueryElement = $("<div>")
          .attr("class", "SelectionArray")
          .append($(`
              <div class="SA-time-bar-wrapper" style="display:none;">
                <span style="font-family:monospace;">Time</span>
                <div class="SA-time-bar">
                </div>
              </div>
              <div class="SA-positioner">
                <div class="SA-wrapper">
                </div>
              </div>
              <div class="SA-actions" style="font-family:monospace;font-size:24px;color:grey;font-weight:bold;margin-bottom:15px;display:none;">
                <span style="transform: translate(calc(-50% + 50px));">NO</span>
                <span style="transform: translate(calc(50% - 50px));">YES</span>
              </div>
              <div class="SA-actions" style="display:none;">
                <button class="SA-btn SA-btn-yes">
                  <span class="SA-btn-top">F</span>
                </button>
                <button class="SA-btn SA-btn-no">
                  <span class="SA-btn-top">J</span>
                </button>
              </div>
          `))
          
        const wrapper = this.jQueryElement.find(".SA-wrapper")
        const cards = this.jQueryElement.find(".SA-card")
        
        this.imgArray.forEach(img => {
            const card = $(`<div class="SA-card"><img class="SA-card-img" src=${img.src}></div>`)
            wrapper.append(card)
        })
        
        const cardImg = this.jQueryElement.find(".SA-card-img")
        const timeBar = this.jQueryElement.find(".SA-time-bar-wrapper div")
        const buttons = this.jQueryElement.find("button.SA-btn")
        const buttonYes = this.jQueryElement.find("button.SA-btn-yes span")
        const buttonNo = this.jQueryElement.find("button.SA-btn-no span")

        // Card traversing logic
        const move_on = () => {
          const len = wrapper.children().length
          const cur = wrapper.children()[len - 1]
          console.log(len)
          console.table({response: that.selections, time: that.times})
          cur.remove()
          clearInterval(that.barTime)
          if (len > 1) {
            that.barTime = that.barShrink()
          } else {
            document.removeEventListener("keydown", this.keydown_fj)
            buttons.css("display", "none")
            this.jQueryElement.css("visibility", "hidden")
          }
        }
        
        // Keydown logic (defined as property)
        this.keydown_fj = e => {
          e.preventDefault
          const key = e.key.toLowerCase()
          if (key == "f") {
              this.selections.push("No")
              this.times.push(this.barTime.stop())
              buttonYes.removeClass("SA-btn-clicked")
              setTimeout(() => {
                buttonYes.addClass("SA-btn-clicked")
              }, 10)
              move_on()
          } else if (key == "j") {
              this.selections.push("Yes")
              this.times.push(this.barTime.stop())
              buttonNo.removeClass("SA-btn-clicked")
              setTimeout(() => {
                buttonNo.addClass("SA-btn-clicked")
              }, 10)
              move_on()
          } else if (key == " ") {
            this.selections.push("NONE")
            this.times.push(this.barTime.stop())
            move_on()
        }
          // When finished, hide other elements and only show the Next button hidden underneath
          if (this.selections.length == this.imgPathArray.length) {
              $(document).find(".PennController-percysay-container").css("display", "none")
          }
        }
        
        // Timer logic
        this.barShrink = function() {
          timeBar.css({"width": "500px"})
          var time = 0;
          var tick = setInterval(increment, 10)
          function increment() {
              time = time + 10;
          }
          return {stop: function() {
            clearInterval(tick)
            return time
          }}
        }
        
        // Button logic
        // buttons.click(event => {
        //    this.selections.push(event.target.textContent)
        //    this.times.push(this.barTime.stop())
        //    move_on()
        // })
        
        // Keypress logic
        
        resolve();

    };
    
    this.end = function(){
        // log
        if (this.log){
            let trialResult = Array.from(that.selections).join(";") + "|" + Array.from(that.times).join(";") + "|" + that.imgPathArray.join(";")
            console.log(trialResult)
            PennEngine.controllers.running.save(this.type, this.id, "Selections", trialResult, this.printTime, "NULL")
        }
        // remove all elements from selection set
        that.selections = []
    };

    this.test = {
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
            document.addEventListener("keydown", this.keydown_fj)
            this.startTime = Date.now()
            this.barTime = this.barShrink()
            resolve();
        }
    }
    
})
