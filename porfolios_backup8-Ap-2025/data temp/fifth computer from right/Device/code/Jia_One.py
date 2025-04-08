import turtle
window = turtle.Screen()
window.setup(2000,1000,0,0)
jia=turtle.Turtle()
jia.shape('turtle')
jia.shapesize(1)
jia.pensize(3)
jia.color('red')
jia.speed(10)
radius=200

jia.color('lightblue')
jia.begin_fill()
jia.circle(radius)
jia.end_fill()

jia.color('blue')
jia.begin_fill()
jia.circle(radius - 25)
jia.end_fill()

jia.color('pink')
jia.begin_fill()
jia.circle(radius - 50)
jia.end_fill()

jia.color('chocolate4')
jia.begin_fill()
jia.circle(radius - 75)
jia.end_fill()

jia.color('violet')
jia.begin_fill()
jia.circle(radius - 100)
jia.end_fill()

jia.color('yellow')
jia.begin_fill()
jia.circle(radius - 125)
jia.end_fill()

jia.color('green')
jia.begin_fill()
jia.circle(radius - 150)
jia.end_fill()

jia.color('blueviolet')
jia.begin_fill()
jia.circle(radius - 175)
jia.end_fill()







turtle.exitonclick()