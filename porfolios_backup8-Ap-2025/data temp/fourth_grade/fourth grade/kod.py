import turtle
window = turtle.Screen()
window.setup(2000, 1800, 0, 0)
window.bgcolor('skyblue')

kod = turtle.Turtle()
kod.speed(10)

# Draw the flagpole
kod.penup()
kod.goto(-465, 350)  # Adjusted starting position
kod.pendown()
kod.color('black')
kod.pensize(15)
kod.right(90)
kod.forward(700)

# Draw the red stripe
kod.penup()
kod.goto(-450, 300)  # Adjusted starting position
kod.pendown()
kod.color('#A51931')  # Red color from the image
kod.begin_fill()
for _ in range(2):
    kod.forward(900)
    kod.right(90)
    kod.forward(100)
    kod.right(90)
kod.end_fill()

# Draw the white stripe
kod.penup()
kod.goto(-450, 200)  # Adjusted starting position
kod.pendown()
kod.color('#F4F5F8')  # White color from the image
kod.begin_fill()
for _ in range(2):
    kod.forward(900)
    kod.right(90)
    kod.forward(100)
    kod.right(90)
kod.end_fill()

# Draw the blue stripe (twice as wide)
kod.penup()
kod.goto(-450, 100)  # Adjusted starting position
kod.pendown()
kod.color('#2D2A4A')  # Blue color from the image
kod.begin_fill()
for _ in range(2):
    kod.forward(900)
    kod.right(90)
    kod.forward(200)
    kod.right(90)
kod.end_fill()

# Draw the white stripe
kod.penup()
kod.goto(-450, -100)  # Adjusted starting position
kod.pendown()
kod.color('#F4F5F8')  # White color from the image
kod.begin_fill()
for _ in range(2):
    kod.forward(900)
    kod.right(90)
    kod.forward(100)
    kod.right(90)
kod.end_fill()

# Draw the red stripe
kod.penup()
kod.goto(-450, -200)  # Adjusted starting position
kod.pendown()
kod.color('#A51931')  # Red color from the image
kod.begin_fill()
for _ in range(2):
    kod.forward(900)
    kod.right(90)
    kod.forward(100)
    kod.right(90)
kod.end_fill()

# Draw the blue square
kod.penup()
kod.goto(-450, 300)  # Adjusted starting position
kod.pendown()
kod.color('#2D2A4A')  # Blue color from the image
kod.begin_fill()
for _ in range(2):
    kod.forward(300)
    kod.right(90)
    kod.forward(200)
    kod.right(90)
kod.end_fill()

# Draw the white stars
kod.color('white')
star_positions = [
    (-430, 270), (-370, 270), (-310, 270), (-250, 270), (-190, 270),
    (-430, 230), (-370, 230), (-310, 230), (-250, 230), (-190, 230)
]

for pos in star_positions:
    kod.penup()
    kod.goto(pos)
    kod.pendown()
    for _ in range(5):
        kod.forward(20)
        kod.right(144)

turtle.exitonclick()