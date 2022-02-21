var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.144.154"; //change this according to your brokers IP
var port = 9001;

function onMessageArrived(r_message)
{
    out_msg = r_message.payloadString;

    if(r_message.destinationName == "carSecurityState")
    {
        console.log("ALED ON VOLE MON AUTO");
    }

}

function onConnect()
{
    // Once a connection has been made, make a subscription and send a message.

    console.log("Connected");
    mqtt.subscribe("carSecurityState");
    sendParams();

}

function MQTTconnect()
{

    console.log("connecting to " + host + " " + port);
    mqtt = new Paho.MQTT.Client(host, port, "clientJSSubscriber");
    //document.write("connecting to "+ host);
    var options = 
    {

        timeout: 3,
        onSuccess: onConnect

    };

    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options); //connect

}

function changeLights()
{
    console.log("ALLO");
    if($("#light_state").html() == "Lights off")
    {
        $("#light_state").html("Lights on");
        $("#light_state").css("backgroundColor","yellow");
        $("#light_state").css("color","black");
    }
    else
    {
        $("#light_state").html("Lights off");
        $("#light_state").css("backgroundColor","black");
        $("#light_state").css("color","white");

    }
}