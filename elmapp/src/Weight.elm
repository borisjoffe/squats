module Weight exposing
    (..)

-- Model
type WeightValue v = Float v | Unknown

type WeightUnit = Kg | Lbs

type alias Weight w =
    { units : WeightUnit
    , value : WeightValue w
    }

-- Curried constructors
weightLbs : WeightValue w -> Weight w
weightLbs = Weight Lbs

weightKg : WeightValue w -> Weight w
weightKg = Weight Kg


-- View
printValue : Weight w -> String
printValue w =
    case .value w of
        Float x -> toString x
        Unknown -> "unknown"

printUnits : Weight w -> String
printUnits w =
    case .units w of
        Kg -> "kg"
        Lbs -> "lbs"

print : Weight w -> String
print w =
    printValue w ++ " " ++ printUnits w
