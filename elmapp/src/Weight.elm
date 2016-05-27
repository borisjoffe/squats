module Weight exposing
    (..)

-- Model
type Value v = Float v | Unknown

type Unit = Kg | Lbs

type alias Weight w =
    { units : Unit
    , value : Value w
    }

-- Curried constructors
weightLbs : Value w -> Weight w
weightLbs = Weight Lbs

weightKg : Value w -> Weight w
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
