#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define WIFI_DELAY_RECONNECT 5000
#define MQTT_BUFFER_SIZE     24

// Change this regarding your WiFi access point 
const char *AP_SSID   = "BaptMobile ";
const char *AP_PASSWD = "Isischat45";
const char *MQTT_IP   = "192.168.43.58";
const long MQTT_PORT  = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

bool ledState = true;
bool carAlert = false;
bool prevCarAlert = false;

void callback(char* topic, byte* payload, unsigned int length)
{  
  
  if((strcmp(topic,"changeLightsState")) == 0)
  {
      Serial.println(ledState);
      ledState = !ledState;
  }

  else if((strcmp(topic,"carSecurityState")))
  {
    prevCarAlert = false;
  }

}

void setup(void)
{
  // Debug purposes
  Serial.begin(115200);
  
  // Initialize WiFi connection
  WiFi.begin(AP_SSID, AP_PASSWD);
  
  // Reattempt connection to WiFi each time it does not work
  while(WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(AP_SSID, AP_PASSWD);
    Serial.println("Connecting to WiFi...");
    delay(WIFI_DELAY_RECONNECT);
  }

  if(WiFi.status() == WL_CONNECTED)
  {
    Serial.println("WiFi connected !");
  }

  // Initialize mqtt communication
  client.setServer(MQTT_IP, MQTT_PORT);
}

void loop(void) 
{
  if (!client.connected())
  {
    Serial.println("Client not connected. Connecting...");
    
    // When connected subscribe to topics
    if (client.connect("clientESPSubscriber"))
    {
      Serial.println("Client connected !");
      client.subscribe("changeLightsState");
      client.subscribe("carSecurityState");
      client.setCallback(callback);
    } 
    
    else 
    {
      // Send error when not connected
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }

  if (carAlert && !prevCarAlert)
  {
    client.publish("carSecurityState","");
    prevCarAlert = true;
  } 
  
  
  client.loop();
}
