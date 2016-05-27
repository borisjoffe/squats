module Util exposing (..)

import String
import Regex exposing (find, HowMany(AtMost), regex)


-- List

safeHead defaultValue xs =
    Maybe.withDefault defaultValue (List.head xs)


safeHeadStr = safeHead ""


firstWord = safeHeadStr << String.words


-- Maybe

join : Maybe (Maybe a) -> Maybe a
join mx =
    case mx of
        Just x -> x
        Nothing -> Nothing


-- String/Regex

parseFloat : String -> Maybe Float
parseFloat s =
    s
    |> find (AtMost 1) (regex "^[0-9]*.{0,1}[0-9]+")
    |> List.head
    |> Maybe.map (.match >> String.toFloat >> Result.toMaybe)
    |> join
