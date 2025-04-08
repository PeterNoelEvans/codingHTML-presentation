import turtle
import math

# Set up the screen
screen = turtle.Screen()
screen.title("Turtle Star Coordinates")
screen.bgcolor("lightblue")

# Create a turtle object
p = turtle.Turtle()
p.speed(1)  # Set turtle speed (1 is the slowest, 10 is the fastest)



# Set up colors and initial position
p.color("yellow")
p.fillcolor("yellow")

# Initialize variables
radius = 300  # Radius of the circumscribed circle
num_points = 5  # Number of points in the star
angle = 144  # Angle to turn the turtle for a star

# Function to draw a star and record coordinates
def draw_star(radius, num_points):
    coordinates = []
    p.penup()
    p.goto(0, 0)
    p.pendown()
    p.begin_fill()  # Start filling the star with color
    
    for _ in range(num_points):
        p.forward(radius * 2 * math.sin(math.radians(36)))  # Side length of the star
        coordinates.append(p.position())
        p.right(angle)
    
    p.end_fill()  # End filling the star with color
    return coordinates

# Draw the star and get the positions
positions = draw_star(radius, num_points)

# Print the recorded positions
for pos in positions:
    print(pos)
p.color('black')
p.pensize(1)
p.forward((radius * 2 * math.sin(math.radians(36)))/3)
p.right(144)
p.forward((radius * 2 * math.sin(math.radians(36)))/3)
# Hide the turtle and display the window
p.hideturtle()
turtle.exitonclick()
