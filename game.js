var table = document.getElementById('gameboard');
let t,g;


class game {
    constructor (row,col) {

        this.row = row;     
        this.col = col;

        this.arr = [];          // Array used to store value of board game
        this.clonearr = [];     // Clone this.arr -> Compare for move
        this.emptyarr = [];     // Array used to store empty cell of board game

        this.cachearr = [];     // Array used to store cache value when key press

        this.leftedge = [];     // Array used to store the cells on the left edge 
        this.rightedge = [];    // Array used to store the cells on the right edge
        this.topedge = [];      // Array used to store the cells on the top edge
        this.bottomedge = [];   // Array used to store the cells on the bottom edge

        this.n;                 // Variable used to store the empty position in "this.emptyarr"

        this.s;                 // Second
        this.m;                 // Minute
        this.h;                 // Hour
        this.firsttime = 0;     // Variable used to check if program is running for the first time
                                // Used to start "start time" function

        this.result = '';       // Variable used to store result 'can move' or 'can not move'

        this.firstcheck = 0;    // Variable used to check if program is running for the first time
                                // Used to load twice "random number"   function
                                // Start game required show two number

        this.createarr();       
        this.drawboard();
        this.checkarr();
        this.firstcheckforrandom();
        this.createedgevalue();
        this.loadboard();
    } 
    //************************ */
    // Create empty array based on row/col value
    createarr() {
        
        for (var i=0; i<this.row*this.col; i++) {

            this.arr[i] = 0;

        }
    }

    //************************ */
    // Draw board game based on row/col value
    // Use <div></div> element contain <input> element, CSS load will correct on heroku server
    drawboard() {

        var output = '';
        var id=0;

        for (var r=0;r<this.row;r++) {
            output += "<tr>";
            for (var c=0; c<this.col; c++) {
                output += "<td><div class='d'><input type='text' readonly id='"+id+"' class='box'></div></td>"
                
                id++;
            }
            output += "</tr>";
        }

        table.innerHTML = output;

    }
    
    //************************ */
    // Check the position of empty cells in the board game, save to "this.emptyarr"
    // The random number that will appear is limited to the range of this array
    checkarr() {
        this.emptyarr = [];
        for (var i=0; i<this.row*this.col; i++) {
            
            if (this.arr[i] == 0) {
                this.emptyarr.push(i);
            }
        }
    }

    //************************ */
    // Color value of the cell containing the number
    colorofnum(x) {
        var color;
        
        switch (x) {
            case 0:
                color = '#e9e9e9';
                break;
            case 2:
                color = '#e8ded4';
                break;
            case 4:
                color = '#e8d9c5';
                break;
            case 8:
                color = '#f8d7ba';
                break;
            case 16:
                color = '#f3bc8c';
                break;
            case 32:
                color = '#eea15d';
                break;
            case 64:
                color = '#e9862f';
                break;
            case 128:
                color = '#ffd966';
                break;
            case 256:
                color = '#ffc61a';
                break;
            case 512:
                color = '#e6ac00';
                break;
            case 1024:
                color = '#cc6666';
                break;
            case 2048:
                color = '#bf4040';
                break;
            case 4096:
                color = '#993333';
                break;
        }
        return color;
    }

    //************************ */
    // Function used to check is new game or not
    firstcheckforrandom() {
        
        if (this.firstcheck == 0) {
            
            this.randomarr();
            this.firstcheck = 1;
        } 
        this.randomarr();
    }

    //************************ */
    // The function is used to create a new value 
    // and randomly appear at the location where the value already exists
    randomarr() {

        //********************************* */
        // Call checkarr function -> have a new empty arr
        // Emptyarr = [0,1,8,5,13,9] -> length = 6
        // Create random number from 0 -> 6 ==> result of random is 3
        // Get the value of '3' in emptyarr ==> emptyarr[3] = 5
        // ((5)) is random position
        // Put << 2 >> in that position

        this.checkarr();

        var i = Math.floor(Math.random()*this.emptyarr.length);

        this.n = this.emptyarr[i];

        this.arr[this.n] = 2;
        
    }

    //************************ */
    // Load value of this.arr to empty board
    loadboard(){

        var id=0;

        for (var i=0; i<this.row*this.col;i++){
            
            var x = this.arr[i];
            var color = this.colorofnum(x);
            var fontcolor = 'white';

            if (x==0) x='';

            document.getElementById(id).value = x;

            if (x==2 || x==4 || x==8) {
                fontcolor = 'black';
            } 

            document.getElementById(id).style.backgroundColor = color;
            document.getElementById(id).style.color = fontcolor;

            id++;
        }
        
    }

    //************************ */
    // Generate the value of the edges, store to 4 array top/bottom/left/right
    createedgevalue() {

        var i,x;
        this.topedge = [];

        //***** [0,1,2,3] */
        for (i=0;i<this.row;i++) {
            x = i;
            this.topedge.push(x);
        }
        
        //***** [0,4,8,12] */
        this.leftedge = [];
        for (i=0;i<this.row;i++) {
            x = this.row*i;
            this.leftedge.push(x);
        }

        //***** [3,7,11,15] */
        this.rightedge = [];
        for (i=0;i<this.row;i++) {
            x = this.leftedge[i]+(this.row-1);
            this.rightedge.push(x);
        }

        //***** [12,13,14,15] */
        this.bottomedge = [];
        for (i=0;i<this.row;i++) {
            x = this.leftedge[(this.row-1)]+i;
            this.bottomedge.push(x);
        }

    }
    
    //************************ */
    // Edit value after omit empty position
    edittemparr() {

        //********************************* */
        // If two cell values are equal, plus them, and splice that cell out of array
        // Minus the counter of loop 1,
        // First cache arr will be [4,2,2] => Length=3 => (3-1)=2
        // Check arr[2] == arr[1] => arr[2]+arr[1]
        // Arr will be [4,2,4]
        // splice(1) out of arr => [4,4] => length=2;
        // Minus 1 for counter
        // Function will check [0] position
        // If not minus 1, function after splice will check [1] position
        // Arr will wrong => [8] => this is wrong

        for (var j=this.cachearr.length-1;j>0;j--) {
                
            var x = this.cachearr[j];
            var y = this.cachearr[j-1];
            if (x==y) {
                x = x+y;
                this.cachearr[j] = x;
                
                this.cachearr.splice((j-1),1);
                
                j--;
            }
            
        }


        // After 
        // Count length of this cache arr
        // add 0 number to the missing position
        // based on row/col off array
        // -------------------------------------------
        // Ex: this.cachearr after it has been processed by the above code
        // Will be [4,4]
        // this.row = 4; this cache arr will be [0,0,4,4]
        // if this.row = 5 => [0,0,0,4,4]
        var l = this.cachearr.length;
        for (var k = 0;k<this.row-l;k++) {
                
            this.cachearr.unshift(0);
        } 
    }

    //************************ */
    // Function check game is can move or not
    canmove() {

        this.result = '';

        var x,y,z,i,j,id;
        x = y = z= 0;

        // check for 2 equal values ​​in 1 row
        for (i=0;i<this.row;i++) {
            for (j=0;j<this.col-1;j++) {

                id = i*this.row+j;
                
                if (this.arr[id]==this.arr[id+1]) {
                    x = '1';
                    break;
                }
            }
            
        }
        
        // check for 2 equal values ​​in 1 col
        for (i = 0; i<this.row-1;i++) { 
            for (j=0;j<this.row;j++) {

            
                id = i*this.row+j;
                if (this.arr[id] == this.arr[id+this.row]) {
                    y='1';
                    break;
                }
            }

        }

        // check empty cell in board
        for (i = 0; i< this.row*this.col;i++) {
            if (this.arr[i]==0) {
                z=1;
                break;
            }
        }
        if (x==0 && y==0 && z==0) {
            // this.result = 'cannotmove';
            return false;
        } else {
            // this.result = 'canmove';
            return true;
        }


    }

    //************************ */
    // Clone this.arr ==> this.clonearr
    copyarr() {
        for (var i = 0;i<this.row * this.col;i++) {
            this.clonearr[i] = this.arr[i];
        }
    }

    //************************ */
    // Compare this.arr after press key, 
    // if have changed is can load random function
    // Not change, not load random function for next move
    comparearr() {
        var count = 0;
        for (var i = 0; i < this.row * this.col; i++) {
            if (this.clonearr[i] == this.arr[i]) {
                count++;
            }
        }
        if (count == this.row*this.col) {
            return true;
        } else {
            return false;
        }
    }

    compare() {
        if (this.comparearr()==false) {
            this.firstcheckforrandom();
            this.loadboard();
        }
    }

    left() {

        this.copyarr();

        for (var i =0;i<this.row;i++) {

            
            //******************************* */
            // Code below
            // Remove blank cells, get cells have value != 0 push to cache arr
            this.cachearr = [];

            for (var j=this.rightedge[i];j>=this.leftedge[i];j--) {
                
                if (this.arr[j]==0) continue;
                this.cachearr.push(this.arr[j]);  
            }
            //--------------------------------------------------------------
            
            this.edittemparr();
            
            // After edit arr
            // Load cache arr to this.arr

            var l=this.row-1;
            for (var k=this.leftedge[i];k<=this.rightedge[i];k++){
                
                this.arr[k]=this.cachearr[l];
                l--;
            }
            

        }

        this.compare();
       
    }
    right() {
        
        this.copyarr();
        for (var i =0;i<this.row;i++) {

            //******************************* */
            // Code below
            // Remove blank cells, get cells have value != 0 push to cache arr
            this.cachearr = [];

            for (var j=this.leftedge[i];j<=this.rightedge[i];j++) {
                
                if (this.arr[j]==0) continue;
                this.cachearr.push(this.arr[j]);

                
            }
            //--------------------------------------------------------------
            
            this.edittemparr();
            
            // After edit arr
            // Load cache arr to this.arr
            
            var l=0;
            for (var k=this.leftedge[i];k<=this.rightedge[i];k++){
                
                this.arr[k]=this.cachearr[l];
                l++;
            }

        }
        this.compare();
    }
    up() {
        this.copyarr();
        for (var i =0;i<this.row;i++) {

            //******************************* */
            // Code below
            // Remove blank cells, get cells have value != 0 push to cache arr
            this.cachearr = [];

            for (var j=this.bottomedge[i];j>=this.topedge[i];j-=this.row) {
                
                if (this.arr[j]==0) continue;
                this.cachearr.push(this.arr[j]);

                
            }
            //--------------------------------------------------------------
            
            this.edittemparr();
            
            // After edit arr
            // Load cache arr to this.arr

            var l=this.row-1;
            for (var k=this.topedge[i];k<=this.bottomedge[i];k+=this.row){
                this.arr[k]=this.cachearr[l];
                l--;
            }

        }
        this.compare();
        
    }
    
    down() {
        this.copyarr();
        
        for (var i =0;i<this.row;i++) {

            //******************************* */
            // Code below
            // Remove blank cells, get cells have value != 0 push to cache arr
            this.cachearr = [];

            for (var j=this.topedge[i];j<=this.bottomedge[i];j+=this.row) {
                
                if (this.arr[j]==0) continue;
                this.cachearr.push(this.arr[j]);

                
            }
            //--------------------------------------------------------------
                        
            this.edittemparr();
                        
            // After edit arr
            // Load cache arr to this.arr
            var l=this.row-1;
            for (var k=this.bottomedge[i];k>=this.topedge[i];k-=this.row){
                
                this.arr[k]=this.cachearr[l];
                l--;
            }

        }
        this.compare();
    }
    gameover() {
        this.cleartime();
        document.getElementById('status').style.display = 'block';
        document.getElementById('contain').style.marginTop = '-600px';
    }
    resettime(){
        this.s = 0;
        this.h = 0;
        this.m = 0;
    }
    
    starttime() {
        
        

        this.s++;
        if (this.s==60) {
            this.s=0;
            this.m++;
            if (this.m==60) {
                this.m=0;
                this.h++;
            }
        }
        this.showtime();
        
        t = setTimeout(() => {this.starttime();},1000);

        
    }

    cleartime() {
        
        
        clearTimeout(t);
        
        if (this.firsttime ==0) {
            document.getElementById('txttime').value = "00:00:00";
        }

        
    }
    

    showtime() {
        
        var xs = 0;
        var xm = 0;
        var xh = 0;
        xs = this.s;
        if (xs<10) xs = "0"+xs.toString();
        if (xm<10) xm = "0"+xm.toString();
        if (xh<10) xh = "0"+xh.toString();
       
        document.getElementById('txttime').value = xh+':'+xm+':'+xs;
    }
}


function firstload(row,col) {
    
    g = new game(row,col);
    g.resettime();
    g.cleartime();
    document.getElementById('status').style.display = 'none';
    document.getElementById('contain').style.marginTop = '20px';

}

firstload(4,4);

document.addEventListener('keydown',CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        
        if (g.canmove()) {
            if (g.firsttime == 0) {
                
                g.starttime();
                g.firsttime = 1;
            }
            g.left();
        } else {
            g.gameover();
        }
    }
    if (event.keyCode == 38) {
        
        if (g.canmove()) {
            if (g.firsttime == 0) {
                
                g.starttime();
                g.firsttime = 1;
            }
            g.up();
        } else {
            g.gameover();
        }
    }
    if (event.keyCode == 39) {
         
        if (g.canmove()) {
            if (g.firsttime == 0) {
                g.starttime();
                g.firsttime = 1;
            }
            g.right();
        } else {
            g.gameover();
        }
    }
    if (event.keyCode == 40) {
         
        if (g.canmove()) {
            if (g.firsttime == 0) {
                g.starttime();
                g.firsttime = 1;
            }
            g.down();
        } else {
            g.gameover();
        }
    }
}


function newgame() {
    var r = parseInt(document.getElementById('list').value); // Use parseInt convert string to number
    firstload(r,r);
}

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

const slider = document.getElementById('contain');

function handleGesture() {

    if (touchstartX > touchstartY) {
        // Up or down
        if (touchendY < touchstartY) g.up();
        if (touchendY > touchstartY) g.down();
    } else {
        if (touchendX < touchstartX) g.left();
        if (touchendX > touchstartX) g.right();
    }
  
  
}

slider.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
  touchstartY = e.changedTouches[0].screenY
})

slider.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  touchendY = e.changedTouches[0].screenY
  handleGesture()
})
