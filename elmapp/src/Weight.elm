module Weight exposing
    (..)
    -- (Weight, WeightUnit, weightLbs, WeightValue)
    -- (Weight, WeightUnit(Kg,Lbs), weightLbs, WeightValue(Float,Unknown))

type WeightValue v = Float v | Unknown

type WeightUnit = Kg | Lbs


type alias Weight w =
    { units : WeightUnit
    , value : WeightValue w
    }


printValue : Weight x -> String
printValue w =
    case .value w of
        Float x -> toString x
        Unknown -> "unknown"

printUnits : Weight x -> String
printUnits w =
    case .units w of
        Kg -> "kg"
        Lbs -> "lbs"

print : Weight x -> String
print w =
    printValue w ++ " " ++ printUnits w

weightLbs : WeightValue a -> Weight a
weightLbs = Weight Lbs
