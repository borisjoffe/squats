module Parse exposing (..)

import String
import Weight

weight : String -> Weight.Weight Float
weight weightStr =
    let value =
        case String.toFloat weightStr of
            Ok x -> Weight.Float x
            Err x -> Weight.Unknown
    in
        Weight.weightLbs value
