module Weight.Parse exposing (..)

import String

import Util
import Weight


defaultUnit = Weight.Lbs


weightValue : String -> Weight.Value Float
weightValue weightStr =
    case Util.parseFloat weightStr of
        Just x -> Weight.Float x
        Nothing -> Weight.Unknown


-- TODO: implement parsing kg or lbs
weightUnit : String -> Weight.Unit
weightUnit weightStr =
    case weightStr of
        _ -> defaultUnit



weight : String -> Weight.Weight Float
weight weightStr =
    Weight.weightLbs (weightValue weightStr)
