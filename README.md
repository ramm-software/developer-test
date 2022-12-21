# RAMM Developer Test
## Overview
The exercise is a simple application that simulates the ability of a user to turn streetlight bulbs on and off individually or in sequence.  Streetlight bulbs can overheat and develop faults. The web interface allows a user to manage and observe the situation of various lights. 

## Business Rules
- Streetlights can be turned on/off as a single unit, which in turn will automatically switch the bulbs on the streetlight on/off.
- Bulbs can be turned on and off individually, but only when the streetlight is active
- Total power consumption of a streetlight is to be monitored
- Bulb heat is to be monitored
- Bulbs generate heat, once a specific heat threshold is reached the bulb will switch off to prevent damage. While in overheat condition they cannot be turned back on. - A bulb that has overheated will not automatically turn back on.
- Faulty bulbs should be indicated as such and will not switch on.
- Streetlights have a light sensor that will turn the streetlight (and all bulbs) on if the reading is less than 100 lumens (and off when the lumens increase past 100 Lumens).  To stop flickering sensors should only change the status after 30 seconds.
 

## Task 1
- Review the project and get a basic idea as to the architecture of the project.
- A user monitoring the system wants to see the total power consumption per streetlight.
   - This must take into account the power consumption of the streetlight (when ON) as well as any bulbs that are currently switched ON.
   - Only bulbs that are switched on should be included.

**Tip:** A computed observable will have to be created that will automatically update the HTML, only the following files need to be adjusted: index.cshtml (see the power draw place holder) and Scripts/Application/application-viewmodel.ts. _Note: switching on a light takes a while – but it does work in the application already – to test the bulbs being on switch the light on and wait a few seconds._ 

## Task 2
- A User monitoring the system should be able to quickly see which bulbs are on/off.
   - Change the colour of the Bulb to yellow if the bulb is on
   - Change the colour of the Bulb to black if the bulb is off   
   - Change the colour of the bulb to red if there is a fault/ over heated

- A User monitoring the system should be able to easily see the temperature of the bulbs this will be indicated by  the temperature / max temperature values changing colour to draw attention:
   - If the temperature is 0 the colour should be Light Grey (example)
   - If the temperature is less than ½ max temperature the colour should be normal colour
   - If the temperature is ½ the max temperature the colour of temperature / max temperature should be Orange (example)
   - If the bulb temperature exceeds the max temperature the font should be bold and the colour Red (example)

**Tip:** You should only need to edit the following files to complete this task: _Index.cshtml and Site.css_

## Task 3
- Turning on streetlights/bulbs takes time as the light server needs to contact the physical light. The user should see a loading indicator to show that the task is in progress
   - The loading indicator should appear whenever an action will take time and should always disappear when that action is complete – even if an error occurs.

**Tip:** Any loading indicator is fine – a simple span element saying ‘Loading…’ when changes occurring is fine or you could create a more elaborate modal. Anything is fine.  You should only need to edit the following files to complete this task: _Index.cshtml, Scripts/application/application-viewmodel.ts and Site.css_

## Task 4
- The User would like to be able to implement the ability to switch a bulb on or off independently of the streetlight carrying it.  Implement a button that will do the following:
   - Automatically toggle between on/off depending on the current bulb state (e.g. isOn)
   - Switching the button should toggle the light on/off depending on the status
   - Bulb can only be switched on if the Streetlight is on
   - If there is a fault the bulb should not be able to be turned on, an error message should be displayed to indicate this, or the button should be disabled until the fault is repaired.

**Tip:** Currently a button exists in the UI that is for this purpose, but it does nothing.  You should only need to edit the following files to accomplish this task: _Index.cshtml, Scripts/application/application-viewmodel.ts. You may be interested or wish to look at the following files for reference: Scripts/application/data-access-layer.ts, Scripts/application/models.ts._

## Task 5
- Currently when a streetlight is switched on/off it switches on each bulb in series. This can take a long time when there are a lot of bulbs for a streetlight.
   - Change the system to turn the streetlight bulbs on in parallel

**Tip:** You should only need to alter method _SwitchOnLight_ and _SwitchOffLight_ on _StreetlightRepository.cs._

## Task 6 – Optional Extension tasks
If you found the previous tasks easy you may want to try this task out.

- The user wishes to be able to simulate failure and also remove failure conditions from a bulb when a repair has been made. Add a button to the UI that will allow a fault-condition to be added to a bulb (or removed in the case when a bulb is in fault). This will be a toggle button.
   - You will need to implement the ‘SetFault’ methods in the API controller and repository to update the bulb status with the failure code or to remove it.
   - The button on each bulb in the UI will need to respond to the current state of the bulb and be able to access the service setting the bulb state accordingly.
