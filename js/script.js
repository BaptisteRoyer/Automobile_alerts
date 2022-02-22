var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.43.58"; //change this according to your brokers IP
var port = 9001;

function onMessageArrived(r_message)
{
    out_msg = r_message.payloadString;

    if(r_message.destinationName == "carSecurityState")
    {
        changeAlert()
    }
    else if(r_message.destinationName == "changeLightsState")
    {
        changeLights();
    }


}

function onConnect()
{
    // Once a connection has been made, make a subscription and send a message.

    console.log("Connected");
    mqtt.subscribe("carSecurityState");
    mqtt.subscribe("changeLightsState");

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

function sendMqttChangeLights()
{
    var topic = "changeLightsState";
    message = new Paho.MQTT.Message("");
    message.destinationName = topic;
    mqtt.send(message);
}


function sendMqttTurnOffAlarm()
{
    var topic = "carSecurityState";
    message = new Paho.MQTT.Message("");
    message.destinationName = topic;
    mqtt.send(message);
}

function changeLights()
{
    if($("#light_state").html() == "Lights off")
    {
        turnLightsOn();
    }
    else
    {
        turnLightsOff();
    }

}

function turnLightsOn()
{
    $("#light_state").html("Lights on");
    $("#light_state").css("backgroundColor","yellow");
    $("#light_state").css("color","black");
}

function turnLightsOff()
{
    $("#light_state").html("Lights off");
    $("#light_state").css("backgroundColor","black");
    $("#light_state").css("color","white");
}

function changeAlert() 
{
    if($("#car_state").html() == "No intruder")
    {
        $("#car_state").html("INTRUDER !!!");
        $("#car_state").css("background-color","red");
       
    }
    else
    {
        $("#car_state").html("No intruder");
        $("#car_state").css("background-color","white");
    }
    
}
