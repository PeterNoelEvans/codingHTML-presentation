# made to show all colors and color names in colors.txt file

import turtle
import random


peter = turtle.Turtle()
peter.shape('turtle')
screen_width = 2000
screen_height = 1000
startx, starty = 0, 0
screen = turtle.Screen()
screen.title('gray colors')
screen.setup(screen_width, screen_height, startx, starty)  # width, height, startx, starty
screen.bgcolor('ivory')
peter.speed(0)
#screen.tracer(0)

color_list = []
gray_list = []
x = -850
y = 450
with open('colors.txt', 'r') as data:
    colors = data.readlines()
    for color in colors:
        if 'gray' in color:
            gray_list.append(color.strip())

print(len(gray_list))
print(gray_list)


# Gray list

radius = 70

count = 0
peter.pu()
peter.goto(x, y)



for color in gray_list:
    if count % 15 == 0:
        y -= radius * 1.7
        peter.goto(x, y)
    print(color)
    peter.color(color, color)
    text = f"  {color}"
    peter.fillcolor(color)
    peter.begin_fill()
    peter.circle(radius, 270)
    peter.pencolor('orange')
    peter.write(text, move=False, align='left', font=('comics', 15, 'normal'))
    peter.circle(radius, 90)
    peter.fillcolor(color)
    peter.begin_fill()
    peter.circle(radius)
    peter.end_fill()
    peter.penup()
    peter.forward(radius * 1.7)
    count += 1



turtle.exitonclick()