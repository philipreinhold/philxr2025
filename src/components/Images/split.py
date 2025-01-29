from PIL import Image

# Dateipfad des hochgeladenen Bildes
input_path = "HW_360_VR_COLOR_CHECK_LOW.jpg"
output_path_top = "HW_360_VR_COLOR_CHECK_LOW_top.jpg"
output_path_bottom = "HW_360_VR_COLOR_CHECK_LOW_bottom.jpg"

# Bild laden
image = Image.open(input_path)
width, height = image.size

# Bild in zwei Hälften teilen
upper_half = image.crop((0, 0, width, height // 2))
lower_half = image.crop((0, height // 2, width, height))

# Getrennte Bilder speichern
upper_half.save(output_path_top)
lower_half.save(output_path_bottom)

print("Bilder gespeichert als:", output_path_top, "und", output_path_bottom)
