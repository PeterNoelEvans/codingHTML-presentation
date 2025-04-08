const int button1 = A0;
const int led1 = 2;
int buttonState = 0;
void setup() {
  pinMode(led1,OUTPUT);
  pinMode(button1,INPUT);
}
  void loop() {
  buttonState = digitalRead(button1);
  if(buttonState==HIGH){
    digitalWrite(led1, HIGH);
  }else{
    digitalWrite(led1, LOW);
   }
  }