import turtle
c = turtle.Turtle()
c.speed(0)

def draw_house():
	c.fillcolor('red')
	c.begin_fill()
	for i in range(2):
		c.forward(200)
		c.right(90)
		c.forward(100)	
		c.right(90)
	c.end_fill()
	c.left(90)
	c.right(30)
	c.forward(200)
	c.right(120)
	c.forward(200)

c.penup()
c.goto(-100,-300)
c.setheading(0)
c.pendown()

draw_house()
c.penup()
c.goto(100,100)
c.setheading(0)
c.pendown()

draw_house()
c.penup()
c.goto(500,500)
c.setheading(0)
c.pendown()
draw_house()


'''

c.fillcolor('red')
c.begin_fill()
c.forward(200)
c.right(90)
c.forward(100)
c.right(90)
c.forward(200)
c.right(90)
c.forward(100)
c.end_fill()

c.right(30)
c.forward(200)
c.right(120)
c.forward(200)
'''
turtle.exitonclick()