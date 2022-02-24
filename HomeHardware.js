const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    MENU: Symbol("menu"),
    SIZE: Symbol("size"),
    BROOMHEAD: Symbol("BroomHead"),
    BMENU: Symbol("bmenu"),
    FMENU: Symbol("fmenu"),
    FSIZE: Symbol("fsize"),
    SNOWGLOVES: Symbol("snowgloves"),
    CLOTH: Symbol("cloth")
});

module.exports = class HomeHardware extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sBroomHead = "";
        this.scloth = "";
        this.sItem = "broom";
        this.Price = 0;
        this.Tax=0;
        this.Total=0;
        this.fSize = "";
        this.snowgloves = "";
        this.fItem = "shovel";
        this.ordermessage="";
    }
    handleInput(sInput){
        let aReturn = [];
        switch (this.stateCur) {
          case OrderState.WELCOMING:
            this.stateCur = OrderState.MENU;
            aReturn.push("Welcome to Sairam's Home Hardware @Curbside Pickup!");
            aReturn.push("Menu: \n 1.Broom \n 2.Shovel");
            aReturn.push(`For a list of what we sell tap:`);
            aReturn.push(`${this.sUrl}/help/${this.sNumber}/`);
            break;
          case OrderState.MENU:
            if (sInput.toLocaleLowerCase() == "broom") {
              this.stateCur = OrderState.SIZE
              aReturn.push("What size broom would you like? Small:$8, Medium: $12, Large: $16");
            }
            else if (sInput.toLocaleLowerCase() == "shovel") {
              this.stateCur = OrderState.FSIZE
              aReturn.push("What size shovel would you like? Small:$6, Medium: $9, Large: $12");
            }
            else {
              aReturn.push("We only offer Broom and Shovel!");
            }
            break;
          case OrderState.SIZE:
            if (sInput.toLocaleLowerCase() == "small") {
              this.Price += 8;
              this.stateCur = OrderState.BROOMHEAD
              this.sSize = sInput;
              aReturn.push("Do you want an extra Broom Head for $4?(Yes/No)");
            }
            else if (sInput.toLocaleLowerCase() == "medium") {
              this.stateCur = OrderState.BROOMHEAD
              this.sSize = sInput;
              this.Price += 12;
              aReturn.push("Do you want an extra Broom Head for $4? (Yes/No)");
            }
            else if (sInput.toLocaleLowerCase() == "large") {
              this.stateCur = OrderState.BROOMHEAD
              this.sSize = sInput;
              this.Price += 16;
              aReturn.push("Do you want an extra Broom Head for $4? (Yes/No)");
            }
            else {
              aReturn.push("We only offer Small/Medium/Large!");
            }
            break;
          case OrderState.BROOMHEAD:
            if (sInput.toLocaleLowerCase() == "yes" || sInput.toLocaleLowerCase() == "no") {
              this.sBroomHead = sInput;
              if (sInput.toLocaleLowerCase() == "yes") {
                this.Price += 4;
              }
    
              if (this.fSize == "") {
                this.stateCur = OrderState.BMENU
                aReturn.push("Would you like our second menu item shovel?(Yes/No)");
              }
              else {
                this.stateCur = OrderState.CLOTH
                aReturn.push("Would you like SIMONIZ car cloth for $8?(Yes/No)");
              }
            }
            else {
              aReturn.push("Please reply with Yes/No!");
            }
            break;
          case OrderState.BMENU:
            if (sInput.toLocaleLowerCase() == "yes") {
              this.stateCur = OrderState.FSIZE
              aReturn.push("What size shovel would you like? Small:$6, Medium: $9, Large: $12");
            }
            else if (sInput.toLocaleLowerCase() == "no") {
              this.stateCur = OrderState.CLOTH
              aReturn.push("Would you like SIMONIZ car cloth for $8?(Yes/No)");
            }
            else {
              aReturn.push("Please reply with Yes/No");
            }
            break;
          case OrderState.FSIZE:
            if (sInput.toLocaleLowerCase() == "small") {
              this.stateCur = OrderState.SNOWGLOVES
              this.fSize = sInput;
              aReturn.push("Do you want Snow gloves for $5? (Yes/No)");
              this.Price += 6;
            }
            else if (sInput.toLocaleLowerCase() == "medium") {
              this.stateCur = OrderState.SNOWGLOVES
              this.fSize = sInput;
              aReturn.push("Do you want Snow gloves for $5?  (Yes/No)");
              this.Price += 9;
            }
            else if (sInput.toLocaleLowerCase() == "large") {
              this.stateCur = OrderState.SNOWGLOVES
              this.fSize = sInput;
              aReturn.push("Do you want Snow gloves for $5?  (Yes/No)");
              this.Price += 12;
            }
            else {
              aReturn.push("We only offer Small/Medium/Large!");
            }
            break;
    
          case OrderState.SNOWGLOVES:
            if (sInput.toLocaleLowerCase() == "yes" || sInput.toLocaleLowerCase() == "no") {
              this.stateCur = OrderState.CLOTH
              this.snowgloves = sInput;
              if (sInput.toLocaleLowerCase() == "yes") {
                this.Price += 5;
              }
              if (this.sSize == "") {
                this.stateCur = OrderState.FMENU
                aReturn.push("Would you like our first menu item broom?(Yes/No)");
              }
              else {
                this.stateCur = OrderState.CLOTH
                aReturn.push("Would you like SIMONIZ car cloth for $8?(Yes/No)");
              }
            }
            else {
              aReturn.push("Please reply with Yes/No!");
            }
            break;
          case OrderState.FMENU:
            if (sInput.toLocaleLowerCase() == "yes") {
              this.stateCur = OrderState.SIZE
              aReturn.push("What size broom would you like? Small:$8, Medium: $12, Large: $16");
            }
            else if (sInput.toLocaleLowerCase() == "no") {
              this.stateCur = OrderState.CLOTH
              aReturn.push("Would you like SIMONIZ car cloth for $8?(Yes/No)");
            }
            else {
              aReturn.push("Please reply with Yes/No");
            }
            break;
          case OrderState.CLOTH:
            if (sInput.toLocaleLowerCase() == "yes" || sInput.toLocaleLowerCase() == "no") {
              if (sInput.toLowerCase() != "no") {
                this.scloth = sInput;
                this.Price += 8;
              }
              this.Tax=this.Price*0.13;
              this.Total=this.Price+this.Tax;
              aReturn.push(`Thank-you for your order of $${this.Price} `);
              aReturn.push(`The Tax(13%) on your order is $${this.Tax} `);
              if (this.sBroomHead.toLocaleLowerCase() == "yes") {
                aReturn.push(`${this.sSize} ${this.sItem} with Broom Head`);
                this.ordermessage+=(`${this.sSize} ${this.sItem} with Broom Head `);
              }
              else if (this.sSize != "") {
                aReturn.push(`${this.sSize} ${this.sItem} with no Broom Head`);
                this.ordermessage+=(`${this.sSize} ${this.sItem} with no Broom Head `);
              }
              if (this.snowgloves.toLocaleLowerCase() == "yes") {
                aReturn.push(`${this.fSize} ${this.fItem} with Snow gloves`);
                this.ordermessage+=(`${this.fSize} ${this.fItem} with Snow gloves `);
              }
              else if (this.fSize != "") {
                aReturn.push(`${this.fSize} ${this.fItem} with no Snow gloves`);
                this.ordermessage+=(`${this.fSize} ${this.fItem} with no Snow gloves `);
              }
              if (this.scloth) {
                aReturn.push(`with SIMONIZ car cloth`);
                this.ordermessage+=(`with SIMONIZ car cloth`);
              }
              aReturn.push(`The total price on your order is $${this.Total} `);
              aReturn.push(`We will text you from 519-222-2222 when your order is ready or if we have questions.`)
              this.isDone(true);
            }
            else {
              aReturn.push("Please reply with Yes/No");
            }
            break;
        }
        return aReturn;
    }
    renderForm(){
      // your client id should be kept private
      return(`
      <html>

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="content-type">
    <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86">
    <style type="text/css">
        .lst-kix_53prcnagnez3-8>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-8
        }

        .lst-kix_53prcnagnez3-2>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-2
        }

        .lst-kix_53prcnagnez3-5>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-5
        }

        ol.lst-kix_53prcnagnez3-0 {
            list-style-type: none
        }

        ol.lst-kix_53prcnagnez3-1 {
            list-style-type: none
        }

        ol.lst-kix_53prcnagnez3-5.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-5 0
        }

        .lst-kix_53prcnagnez3-0>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-0, decimal) ". "
        }

        ol.lst-kix_53prcnagnez3-4 {
            list-style-type: none
        }

        ol.lst-kix_53prcnagnez3-5 {
            list-style-type: none
        }

        ol.lst-kix_53prcnagnez3-1.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-1 0
        }

        ol.lst-kix_53prcnagnez3-2 {
            list-style-type: none
        }

        ol.lst-kix_53prcnagnez3-3 {
            list-style-type: none
        }

        .lst-kix_53prcnagnez3-0>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-0
        }

        ol.lst-kix_53prcnagnez3-0.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-0 0
        }

        ol.lst-kix_53prcnagnez3-6.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-6 0
        }

        .lst-kix_53prcnagnez3-6>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-6
        }

        ol.lst-kix_53prcnagnez3-8.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-8 0
        }

        ol.lst-kix_53prcnagnez3-3.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-3 0
        }

        .lst-kix_53prcnagnez3-3>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-3
        }

        ol.lst-kix_53prcnagnez3-4.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-4 0
        }

        .lst-kix_53prcnagnez3-7>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-7, lower-latin) ". "
        }

        .lst-kix_53prcnagnez3-4>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-4
        }

        .lst-kix_53prcnagnez3-7>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-7
        }

        .lst-kix_53prcnagnez3-8>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-8, lower-roman) ". "
        }

        .lst-kix_53prcnagnez3-2>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-2, lower-roman) ". "
        }

        ol.lst-kix_53prcnagnez3-8 {
            list-style-type: none
        }

        .lst-kix_53prcnagnez3-1>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-1, lower-latin) ". "
        }

        .lst-kix_53prcnagnez3-3>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-3, decimal) ". "
        }

        ol.lst-kix_53prcnagnez3-6 {
            list-style-type: none
        }

        ol.lst-kix_53prcnagnez3-7.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-7 0
        }

        ol.lst-kix_53prcnagnez3-7 {
            list-style-type: none
        }

        .lst-kix_53prcnagnez3-1>li {
            counter-increment: lst-ctn-kix_53prcnagnez3-1
        }

        ol.lst-kix_53prcnagnez3-2.start {
            counter-reset: lst-ctn-kix_53prcnagnez3-2 0
        }

        .lst-kix_53prcnagnez3-6>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-6, decimal) ". "
        }

        .lst-kix_53prcnagnez3-5>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-5, lower-roman) ". "
        }

        .lst-kix_53prcnagnez3-4>li:before {
            content: ""counter(lst-ctn-kix_53prcnagnez3-4, lower-latin) ". "
        }

        ol {
            margin: 0;
            padding: 0
        }

        table td,
        table th {
            padding: 0
        }

        .c2 {
            border-right-style: solid;
            padding: 5pt 5pt 5pt 5pt;
            border-bottom-color: #000000;
            border-top-width: 1pt;
            border-right-width: 1pt;
            border-left-color: #000000;
            vertical-align: top;
            border-right-color: #000000;
            border-left-width: 1pt;
            border-top-style: solid;
            border-left-style: solid;
            border-bottom-width: 1pt;
            width: 234pt;
            border-top-color: #000000;
            border-bottom-style: solid
        }

        .c1 {
            color: #000000;
            font-weight: 400;
            text-decoration: none;
            vertical-align: baseline;
            font-size: 18pt;
            font-family: "Arial";
            font-style: normal
        }

        .c7 {
            padding-top: 0pt;
            padding-bottom: 0pt;
            line-height: 1.15;
            orphans: 2;
            widows: 2;
            text-align: left;
            height: 11pt
        }

        .c5 {
            padding-top: 0pt;
            padding-bottom: 0pt;
            line-height: 1.15;
            orphans: 2;
            widows: 2;
            text-align: center;
            height: 11pt
        }

        .c10 {
            color: #000000;
            font-weight: 700;
            text-decoration: none;
            vertical-align: baseline;
            font-size: 20pt;
            font-family: "Arial";
            font-style: italic
        }

        .c8 {
            padding-top: 0pt;
            padding-bottom: 0pt;
            line-height: 1.15;
            orphans: 2;
            widows: 2;
            text-align: center
        }

        .c12 {
            border-spacing: 0;
            border-collapse: collapse;
            margin-right: auto
        }

        .c3 {
            padding-top: 0pt;
            padding-bottom: 0pt;
            line-height: 1.0;
            text-align: center
        }

        .c0 {
            background-color: #ffffff;
            max-width: 468pt;
            padding: 72pt 72pt 72pt 72pt
        }

        .c6 {
            color: #ff9900;
            font-size: 18pt
        }

        .c9 {
            font-size: 18pt
        }

        .c11 {
            background-color: #ff9900
        }

        .c4 {
            height: 0pt
        }

        .title {
            padding-top: 0pt;
            color: #000000;
            font-size: 26pt;
            padding-bottom: 3pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        .subtitle {
            padding-top: 0pt;
            color: #666666;
            font-size: 15pt;
            padding-bottom: 16pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        li {
            color: #000000;
            font-size: 11pt;
            font-family: "Arial"
        }

        p {
            margin: 0;
            color: #000000;
            font-size: 11pt;
            font-family: "Arial"
        }

        h1 {
            padding-top: 20pt;
            color: #000000;
            font-size: 20pt;
            padding-bottom: 6pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h2 {
            padding-top: 18pt;
            color: #000000;
            font-size: 16pt;
            padding-bottom: 6pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h3 {
            padding-top: 16pt;
            color: #434343;
            font-size: 14pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h4 {
            padding-top: 14pt;
            color: #666666;
            font-size: 12pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h5 {
            padding-top: 12pt;
            color: #666666;
            font-size: 11pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h6 {
            padding-top: 12pt;
            color: #666666;
            font-size: 11pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            font-style: italic;
            orphans: 2;
            widows: 2;
            text-align: left
        }
    </style>
</head>

<body class="c0">
    <p class="c8"><span class="c10">Sairam&#39;s Home Hardware @Curbside Pickup Help Guide!</span></p>
    <p class="c5"><span class="c1"></span></p>
    <p class="c8"><span class="c9">Sms </span><span class="c6">519-222-2222</span><span class="c1">&nbsp;now to place
            your order!</span></p>
    <p class="c5"><span class="c1"></span></p>
    <p class="c5"><span class="c1"></span></p>
    <p class="c8"><span class="c1">We got the best prices for all your hardware needs!</span></p>
    <p class="c7"><span class="c1"></span></p>
    <p class="c7"><span class="c1"></span></p><a id="t.aee00af855f78288420a466cddc2508d0abf6b82"></a><a id="t.0"></a>
    <table class="c12">
        <tbody>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Broom - Large</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$16</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Broom - Medium</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$12</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Broom - Small</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$8</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Extra Broom Head</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$4</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Shovel - Large</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$12</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Shovel - Medium</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$9</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Shovel - Small</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$6</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">Snow Gloves add-on</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c3"><span class="c1">$5</span></p>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="c7"><span class="c1"></span></p>
    <p class="c5"><span class="c1"></span></p>
    <p class="c8"><span class="c9">Also checkout our </span><span class="c9 c11">SIMONIZ car cloth</span><span
            class="c1">&nbsp;set for just $8!</span></p>
</body>

</html>      `);
  
    }
}
