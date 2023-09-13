"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "../../../node_modules/next/navigation"
import { ReactBingmaps } from "react-bingmaps"

const KEY = "AjESHK1fkVQuRadCk6RuUCt9i4-9U0Qj6a3B-TuN8wSj1HniQMtNOJEwM0Oe94a5"

export default function Map() {
  const [searchedCountry, setSearchedCountry] = useState<string>(null)
  const [countryCoordinates, setCountryCoordinates] = useState<object>()

  const searchedCountryCode = useSearchParams().get("countryCode")

  useEffect(() => {
    if (searchedCountryCode) {
      setSearchedCountry(searchedCountryCode)
    }
  }, [])

  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchedCountryCode}`
    )
      .then((data) => {
        return data.json()
      })
      .then((locations) => {
        const validLocation =
          locations.length > 1
            ? locations.filter((location) => {
                return (
                  location.addresstype === "country" ||
                  location.addresstype === "territory" ||
                  location.addresstype === "state" ||
                  location.addresstype === "administrative" ||
                  location.addresstype === "island" ||
                  location.addresstype === "disputed"
                )
              })[0]
            : locations[0]

        setCountryCoordinates({
          center: [validLocation.lat, validLocation.lon],
        })
      })
  }, [searchedCountry])

  return (
    <div>
      {countryCoordinates ? (
        <ReactBingmaps
          bingmapKey={KEY}
          center={countryCoordinates.center}
          zoom={6}
          disableLocateMeButton={true}
        >
          <ReactBingmaps.Layer
            id="countryLayer"
            shapeData={{
              type: "Polygon",
            }}
          />
        </ReactBingmaps>
      ) : null}
    </div>
  )
}
