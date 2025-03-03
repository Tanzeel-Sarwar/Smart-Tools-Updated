"use client"

import type React from "react"
import Image from "next/image"

import { useState, useEffect, Suspense } from "react"
import { Cloud, Sun, Moon, Droplets, Wind, Thermometer, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"

interface WeatherData {
  city: string
  country: string
  current: {
    temp: number
    humidity: number
    wind_speed: number
    weather: {
      main: string
      description: string
      icon: string
    }
  }
  forecast: Array<{
    date: string
    temp: {
      min: number
      max: number
    }
    weather: {
      main: string
      icon: string
    }
  }>
}

interface City {
  name: string
  country: string
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
const API_BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct"

function WeatherContent() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<City[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const lastCity = localStorage.getItem("lastSearchedCity")
    if (lastCity) {
      setCity(lastCity)
      fetchWeatherData(lastCity)
    }
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length > 2) {
        const response = await fetch(`${GEO_API_URL}?q=${city}&limit=5&appid=${API_KEY}`)
        const data = await response.json()
        setSuggestions(data.map((item: any) => ({ name: item.name, country: item.country })))
      } else {
        setSuggestions([])
      }
    }

    const debounce = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounce)
  }, [city])

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true)
    try {
      const currentResponse = await fetch(`${API_BASE_URL}/weather?q=${cityName}&units=metric&appid=${API_KEY}`)
      const forecastResponse = await fetch(`${API_BASE_URL}/forecast?q=${cityName}&units=metric&appid=${API_KEY}`)

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error("City not found")
      }

      const currentData = await currentResponse.json()
      const forecastData = await forecastResponse.json()

      const processedData: WeatherData = {
        city: currentData.name,
        country: currentData.sys.country,
        current: {
          temp: Math.round(currentData.main.temp),
          humidity: currentData.main.humidity,
          wind_speed: currentData.wind.speed,
          weather: {
            main: currentData.weather[0].main,
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
          },
        },
        forecast: forecastData.list
          .filter((_: any, index: number) => index % 8 === 0)
          .slice(0, 5)
          .map((day: any) => ({
            date: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
            temp: {
              min: Math.round(day.main.temp_min),
              max: Math.round(day.main.temp_max),
            },
            weather: {
              main: day.weather[0].main,
              icon: day.weather[0].icon,
            },
          })),
      }

      setWeatherData(processedData)
      localStorage.setItem("lastSearchedCity", cityName)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeatherData(city)
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: City) => {
    setCity(`${suggestion.name}, ${suggestion.country}`)
    fetchWeatherData(`${suggestion.name}, ${suggestion.country}`)
    setSuggestions([])
  }

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case "01d":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "01n":
        return <Moon className="w-8 h-8 text-gray-300" />
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud className="w-8 h-8 text-gray-400" />
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return <Droplets className="w-8 h-8 text-blue-400" />
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-[100px]" />
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Weather hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Weather Forecast</h1>
          <p className="text-gray-600">Check the weather for any city worldwide</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                  <Input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-9 pr-4"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              {suggestions.length > 0 && (
                <Card className="absolute z-20 w-full mt-1 border shadow-lg">
                  <CardContent className="p-0 max-h-[200px] overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start rounded-none hover:bg-gray-100"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.name}, {suggestion.country}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          weatherData && (
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {weatherData.city}, {weatherData.country}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    {getWeatherIcon(weatherData.current.weather.icon)}
                    <span className="text-4xl font-bold ml-4">{weatherData.current.temp}°C</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl">{weatherData.current.weather.main}</p>
                    <p className="text-gray-500">{weatherData.current.weather.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Humidity: {weatherData.current.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <Wind className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Wind: {weatherData.current.wind_speed} m/s</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Feels like: {weatherData.current.temp}°C</span>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="text-center">
                        <p className="font-medium">{day.date}</p>
                        {getWeatherIcon(day.weather.icon)}
                        <p className="mt-1">
                          {day.temp.min}° / {day.temp.max}°
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}

export default function Weather() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Loader />
        </div>
      }
    >
      <WeatherContent />
    </Suspense>
  )
}

