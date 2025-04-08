import turtle
import random
import time

# Set up the screen
screen = turtle.Screen()
screen.title("Real-Time Position Tracking")
screen.bgcolor("green")
screen.setup(width=800, height=600)

# Draw the football field
field = turtle.Turtle()
field.hideturtle()
field.speed(0)
field.color("white")
field.penup()
field.goto(-350, -250)
field.pendown()
for _ in range(2):
    field.forward(700)
    field.left(90)
    field.forward(500)
    field.left(90)

# Create player turtles
players = {}
player_colors = ["red", "blue", "yellow", "purple", "orange"]

for i in range(1, 6):  # Create 5 players for example
    player = turtle.Turtle()
    player.shape("circle")
    player.color(player_colors[i-1])
    player.penup()
    players[f"Player{i}"] = player

# Function to simulate and update player positions
def update_positions():
    for player_id, player in players.items():
        # Simulate new positions
        new_x = random.randint(-350, 350)
        new_y = random.randint(-250, 250)
        player.goto(new_x, new_y)

# Main loop to update positions
while True:
    update_positions()
    screen.update()
    time.sleep(1)  # Update every second

# Keep the window open
screen.mainloop()
