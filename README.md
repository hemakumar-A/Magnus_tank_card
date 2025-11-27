# Magnus_tank_card

# Magnus Tank Card for Home Assistant

## Install via HACS
1. HACS → Frontend → Custom Repositories → Add
2. Repository: https://github.com/yourname/ha-lottie-tank-card
3. Category: Frontend
4. Install and refresh HA

## Example Card Config
```yaml
type: custom:esp-ha-tank-dashboard-card
tank_entity: sensor.water_tank_sensor_water_tank_level
battery_entity: sensor.water_tank_sensor_water_tank_battery
tank_json: /local/lottie/samplyytt.json
battery_json: /local/lottie/battery.json

