const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

const frontendDir = path.join(__dirname, "..", "Frontend");

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "KrishiAI"
    });
});


/* =========================
   WEATHER API
========================= */

app.get("/api/weather", async (req, res) => {

    try {

        // Default location: Nashik
        const latitude =
            Number(req.query.lat) || 20.0059;

        const longitude =
            Number(req.query.lon) || 73.7897;


        const weatherURL =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m` +
            `&daily=precipitation_probability_max` +
            `&timezone=auto`;


        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                `Weather API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        const current =
            data.current;


        const daily =
            data.daily;


        /* Convert weather code to readable condition */

        const condition =
            getWeatherCondition(
                current.weather_code
            );


        res.json({

            success: true,

            location: {
                latitude,
                longitude
            },

            weather: {

                temperature:
                    current.temperature_2m,

                feelsLike:
                    current.apparent_temperature,

                humidity:
                    current.relative_humidity_2m,

                windSpeed:
                    current.wind_speed_10m,

                precipitation:
                    current.precipitation,

                rain:
                    current.rain,

                rainChance:
                    daily.precipitation_probability_max?.[0] ?? 0,

                weatherCode:
                    current.weather_code,

                condition

            }

        });

    } catch (error) {

        console.error(
            "Weather API Error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to fetch weather data"

        });

    }

});


/* =========================
   WEATHER CODE MAPPING
========================= */

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "Foggy";
    }

    if (
        code >= 51 &&
        code <= 57
    ) {
        return "Drizzle";
    }

    if (
        code >= 61 &&
        code <= 67
    ) {
        return "Rain";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "Snow";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "Rain showers";
    }

    if (
        code >= 95
    ) {
        return "Thunderstorm";
    }

    return "Unknown";
}


/* =========================
   FRONTEND
========================= */

app.use(
    express.static(frontendDir)
);


app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            frontendDir,
            "index.html"
        )
    );

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `KrishiAI server running on http://localhost:${PORT}`
    );

});