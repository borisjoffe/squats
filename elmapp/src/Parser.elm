

type WeightMagnitude = Float | Unknown
type WeightUnit = Kg | Lbs

type alias Weight =
    { value : WeightMagnitude
    , units = WeightUnit
    }
