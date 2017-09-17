// ==UserScript==
// @namespace   flutter_packing_list
// @include     https://flutterwireless.backerkit.com/admin/backers/*/pack_list
// @name        Flutter packing list
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant       none
// ==/UserScript==

$("head").append("<link href='https://fonts.googleapis.com/css?family=Josefin+Sans' rel='stylesheet'>");

$(".page").not(".controls").before (
    '<img id="flutter_logo" alt="" src="http://flutterwireless.com/files/packing_list.png">'
);


$(".page").children("br").remove();
$(".page").children("h2")[0].remove();

$(".to").children("br").last().remove();

var totals = $(".totals").html();
var to = $(".to").html();
to = to.replace("000000000","");
$(".to").remove();
$(".totals").remove();
$(".questions").remove();
$(".page.controls").remove();
$("legend").remove();


$(".page").css("margin-bottom","0px");


$(".reward").before(
"  <table style='margin-top:10px;'>  <tr>  <td>" + to + "</td>  <td>" + totals + "</td>  </tr>   </table>"
);

 $(".backerkit-order").find('tr').each(function () {
     if ($(this).is('tr:contains("token")'))
     {
       $(this).remove()
     }
 });

 var rowCount = $(".backerkit-order tr").length;
 if (rowCount == 1)
 {
   $(".backerkit-order").remove()
 }


$(".table.skus.skus-expanded").find('small').each(function() {
        $(this).text($(this).text().replace("Flutter Pro Kit with box", "Flutter Pro Kit"));
        $(this).text($(this).text().replace("Flutter Connect", "Flutter Connect (backordered)"));
        $(this).text($(this).text().replace("Arduino Shield adapter", "Arduino Shield adapter (backordered)"));
        $(this).text($(this).text().replace("Flutter Bluetooth board", "Flutter Bluetooth board (backordered)"));
        $(this).text($(this).text().replace("T-shirt, XL", "T-shirt, XL (backordered)"));
        $(this).text($(this).text().replace("T-shirt, L", "T-shirt, L (backordered)"));
        $(this).text($(this).text().replace("T-shirt, M", "T-shirt, M (backordered)"));
        $(this).text($(this).text().replace("T-shirt, S", "T-shirt, S (backordered)"));
        $(this).text($(this).text().replace("T-shirt, XS", "T-shirt, XS (backordered)"));
        //$(this).text($(this).text().replace("Flutter Lithium Cell 1000mah", "Flutter Lithium Cell 1000mah (backordered)"));
      //  console.log($(this).text());
});


//$("td").css ( "padding-bottom",'5px').css( "padding-top",'5px');

$("#flutter_logo").css ( {
    position:   "relative",
    width:      "800px",
    top:        "0",
    left:       "30"
} );

console.log("complete");

var rows = $(".table.skus.skus-expanded").children("tbody").children("tr");

$(".table.skus.skus-expanded").after(
  "<table class='table skus skus-corrected table-condensed table-striped' style='font-family: Josefin Sans;'>\
          <thead>\
          <tr>\
            <th style='font-size: 16pt; font-family: Josefin Sans;'>SKU</th>\
            <th style='font-size: 16pt; font-family: Josefin Sans;'>Name</th>\
            <th style='font-size: 16pt; font-family: Josefin Sans;'>Quantity</th>\
          </tr>\
          </thead>\
          <tbody>\
          </tbody>\
        </table>"
      );


var rewards = [
  ['Flutter Basic','Flutter Basic with box and foam','FL-0001', 0],
  ['Flutter Pro','Flutter Pro Kit','FL-0002', 0],
  ['Flutter Breakout','Flutter Breakout Kit','FL-0003', 0],
  ['Flutter Explorer','Flutter Explorer','FL-0004', 0],
  ['Bluetooth Shield - Bluetooth 4.0 Low Energy','Flutter Bluetooth board (backordered)','FL-0005', 0],
  ['Network Shield','Flutter Connect (backordered)','FL-0006', 0],
  ['Flutter Starter Kit','Flutter Starter Kit','FL-0007', 0],
  ['1000 mAh lipo battery','Flutter Lithium Cell 1000mah','FL-0008', 0],
  ['Shield Shield','Arduino Shield adapter (backordered)','FL-0009', 0],
  ['T-shirt, XS (backordered)', 'T-shirt, XS (backordered)', 'FL-0010', 0],
  ['T-shirt, S (backordered)', 'T-shirt, S (backordered)', 'FL-0011', 0],
  ['T-shirt, M (backordered)', 'T-shirt, M (backordered)', 'FL-0012', 0],
  ['T-shirt, L (backordered)', 'T-shirt, L (backordered)', 'FL-0013', 0],
  ['T-shirt, XL (backordered)', 'T-shirt, XL (backordered)', 'FL-0014', 0],
  ['3D printed controller housing', '3D printed controller housing', 'FL-0017', 0],
  ['USB Cable','USB Cable','FL-0018', 0],
  ['Flutter Remote','Flutter Remote','FL-0019', 0],
  ['18650 Cell','18650 Cell','FL-0020', 0],
  ['Upgrade: Basic to Pro','Upgrade, Flutter Basic to Flutter Pro','FL-0015', 0]

]

$(".backerkit-order").remove()


  var upgrade_quantity = 0;
  var include_backorders = false;
  var arrayLength = rewards.length;
  for (var i = 0; i < arrayLength; i++) {
    var reward = rewards[i]
    var count = 0

    $(".table.skus.skus-expanded").find('tr').each(function () {
      itemname = $(this).children('td:nth-child(2)')
      if(itemname.length > 0)
      {
        if (itemname.find('small').text() === reward[1])
        {
         var count_string = $(this).children('td:nth-child(3)').text();
         reward[3] += parseInt(count_string)
         console.log(reward[1] + " count: " + reward[3])
        }
      }
    });

    // Adjust the Pro and the Basic by the count of Upgrade items.
    if(reward[0]==='Upgrade: Basic to Pro')
    {
      rewards[0][3]-=reward[3]
      rewards[1][3]+=reward[3]
      upgrade_quantity = reward[3]
    }

    if(reward[1].includes("backordered") && count > 0)
    {
      include_backorders = true;
    }

  }

  // Fix USB cable counts
  if(rewards[1][3] > rewards[15][3])
  {
    console.log("Upping USB cable QTY from " + rewards[15][3] + " to " + rewards[1][3]);
    rewards[15][3]=rewards[1][3]
  }




  if(include_backorders)
  {
    $(".table.skus.skus-corrected").after(
      "<table class='table skus skus-backorders table-condensed table-striped' style='font-family: Josefin Sans;'>\
              <thead>\
              <tr>\
                <th style='font-size: 16pt; font-family: Josefin Sans;'>SKU</th>\
                <th style='font-size: 16pt; font-family: Josefin Sans;'>Name</th>\
                <th style='font-size: 16pt; font-family: Josefin Sans;'>Quantity</th>\
              </tr>\
              </thead>\
              <tbody>\
              </tbody>\
            </table>"
          );
  }
$(".table.skus.skus-backorders").after("<div>Note: Backordered items will ship separately or their value will be refunded.</div>");

  //add the items to their table
  for (var i = 0; i < arrayLength-1; i++) {
    var reward = rewards[i]
    if(reward[3]!=0)
    {
      if(reward[1].includes("backordered"))
      {
        $('.table.skus-backorders').append('<tr><td style="font-size: 16pt; font-family: Josefin Sans;"><small>'+ reward[2] +'</small></td><td style="font-size: 16pt; font-family: Josefin Sans;"><small>'+ reward[1] +'</small></td><td style="font-size: 16pt; font-family: Josefin Sans;"><small>' + reward[3] + '</small></td></tr>')

      }
      else
      {
        $('.table.skus-corrected').append('<tr><td style="font-size: 16pt; font-family: Josefin Sans;"><small>'+ reward[2] +'</small></td><td style="font-size: 16pt; font-family: Josefin Sans;"><small>'+ reward[1] +'</small></td><td style="font-size: 16pt; font-family: Josefin Sans;"><small>' + reward[3] + '</small></td></tr>')
      }

    }
  }

$(".table.skus.skus-corrected").before("<div class='title'>Items in this shipment</div>");
$(".table.skus.skus-backorders").before("<div class='title'>Backordered items</div>");

if(upgrade_quantity==1)
{
  $(".table.skus.skus-corrected").after("<div class='note'>Note: Above count reflects " + upgrade_quantity + " upgrade from Basic to Pro.</div><br>");
}
if(upgrade_quantity>1)
{
  $(".table.skus.skus-corrected").after("<div class='note'>Note: Above count reflects " + upgrade_quantity + " upgrades from Basic to Pro.</div><br>");
}


$(".title").css( "font-size",'16pt').css ("font-family",'Josefin Sans');//.css ( "font-weight",'bold')

$("td").css( "font-size",'16pt');//.css ( "font-weight",'bold')
$(".backerkit-order,h1,.reward,.table.skus.skus-expanded,.table.skus.skus-corrected,th,td").css ( "font-family",'Josefin Sans');//.css ( "font-size",'20pt').css ( "font-weight",'bold');


$(".table.skus-expanded").remove()


console.log(rows);

$("iframe").remove();
$(".intercom-container").remove();

$(".page").after(`
<script>
function printPage(){

  var file_root = "/media/taylor/feynman/Dropbox/Flutter/Shipping/Fulfillment/Pack Lists/next_shipment/"

  var file_name = window.location.pathname.split("/")[3]+".pdf"


  jsPrintSetup.setPrinter('Print to File');
  // I think that output format in this case has no sense, because is used printer driver to render it
  jsPrintSetup.setOption('outputFormat', jsPrintSetup.kOutputFormatPDF);
  jsPrintSetup.setOption('printToFile', 1);
  jsPrintSetup.setOption('toFileName', file_root+file_name);

  // set page header
  jsPrintSetup.setOption('headerStrLeft', '');
  jsPrintSetup.setOption('headerStrCenter', '');
  jsPrintSetup.setOption('headerStrRight', '');
  // set empty page footer
  jsPrintSetup.setOption('footerStrLeft', '');
  jsPrintSetup.setOption('footerStrCenter', '');
  jsPrintSetup.setOption('footerStrRight', '');
  // Suppress print dialog
  jsPrintSetup.setSilentPrint(true);

  jsPrintSetup.print();
}
</script>
`);

$(".page").before("<button id='printPageButton' class='page instructions' onClick='printPage();'>Print</button>").css("@media print {#printPageButton {display: none;}}");

console.log("Greasemonkey script executed fully.")
