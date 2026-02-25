

# 3D Dimensional Persona Visualization

## Overview
An interactive 3D cube visualization where personality dimensions (Optimism, Authority, Emotional) map to X/Y/Z axes. Users can explore preset persona points or freely navigate the continuous space, demonstrating the difference between discrete and continuous persona modeling.

---

## Page 1: Main Visualization Page

### 3D Cube Scene (Left/Center)
- A wireframe cube spanning -1 to +1 on each axis using Three
- Axis labels at the ends: Pessimistic/Optimistic, Submissive/Assertive, Analytical/Emotional
- OrbitControls for rotating, panning, and zooming the view
- Light gray cube edges with semi-transparent styling

### Preset Persona Spheres
- 8 color-coded spheres positioned at their dimension coordinates:
  - Anxious (Orange), Analytical (Blue), Assertive (Cyan), Optimistic (Green), Defeated (Gray), Neutral (White), Worried Elder (Amber), Demanding (Red)
- Each sphere labeled with its persona name
- Spheres pulse subtly on hover
- Clickable in Discrete mode to snap the user's position

### User Position Sphere
- Larger glowing cyan sphere representing the current position
- Smoothly animates when position changes
- Draggable directly in the 3D scene during Continuous mode

### Info Panel (Right Side)
- Displays current X/Y/Z coordinate values
- Shows nearest preset persona name and distance
- In Continuous mode: shows "Custom configuration" when between presets
- Lists nearby presets sorted by distance

---

## Controls (Below Visualization)

### Mode Toggle
- Two-option toggle switch: **Discrete** vs **Continuous**
- Animated transition between modes (preset points fade/brighten, glow effects change)

### Dimension Sliders
- Three horizontal sliders for Optimism, Authority, and Emotional (-1 to +1)
- In Discrete mode: sliders are disabled, showing the selected preset's values
- In Continuous mode: fully interactive, driving the user sphere's position in real-time

### Discrete Mode Preset List
- Clickable list of all preset personas
- Selecting one snaps the position and updates sliders

---

## Animations & Transitions

- **Discrete → Continuous**: Preset points fade to 50% opacity, user sphere gains glow, sliders unlock, message "Explore the full persona space"
- **Continuous → Discrete**: User snaps to nearest preset, presets return to full opacity, sliders lock, message "Limited to predefined personas"
- Smooth spring-based transitions for all position changes

---

## Visual Design
- Clean, modern look with a light gray (#F8FAFC) visualization background
- Rounded corners and subtle borders on all panels
- Responsive layout: visualization and info panel side by side on desktop, stacked on mobile
- Dark text with clear typography for labels and values

