import turtle
import time

mack = turtle.Turtle()
screen = turtle.Screen()
screen.bgcolor('skyblue')
mack.shape('turtle')
mack.speed(5)

radius = 30
y = 250
mack.penup()
mack.goto(-300,y)
mack.pendown()
for i in range(0, 100):
	print(i)
	print(i%10)
	mack.pendown()
	mack.circle(radius)
	mack.penup()
	mack.forward(radius*2)
	if i % 10 == 0:
		y = y - radius * 2
		mack.goto(-300,y)
		mack.pendown()

turtle.exitonclick()