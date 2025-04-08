import turtle
import time
win = turtle.Screen()
win.title("Peter's Traffic Light")
win.bgcolor('skyblue')
peter = turtle.Turtle()
paul = turtle.Turtle()
radius = 100
paul.penup()
paul.goto(0, -2*radius)
peter.speed(0)
paul.speed(0)

for i in range(20):
	paul.hideturtle()
	peter.hideturtle()
	if i%2 == 1:
		peter.fillcolor('red')
	else:
		peter.fillcolor('green')
	peter.begin_fill()
	peter.circle(radius)
	peter.end_fill()

	if i%2 == 1:
		paul.fillcolor('green')
	else:
		paul.fillcolor('red')
	paul.begin_fill()
	paul.circle(radius)
	paul.end_fill()
	time.sleep(1)


turtle.exitonclick()