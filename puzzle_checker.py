with open("easy_puzzles.txt", "r") as f:
    lines = f.readlines()
with open("easy_puzzles.txt", "w") as f:
    idx = 0
    num_count = 0
    for line in lines:
        clr = False
        if (idx % 2 == 0):
            num_count = 0
            for char in line:
                if (char != '-'):
                    num_count += 1
        if (num_count <= 45):
            f.write(line)
        idx += 1

