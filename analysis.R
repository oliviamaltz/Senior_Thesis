library(penngradlings) # devtools::install_github("yjunechoe/penngradlings")
library(tidyverse)

df <- read_pcibex(r"(C:\Users\jchoe\Downloads\results_dev (7).csv)")

critical_trials <- df |>
  filter(PennElementType == "TextInput", Parameter == "Final", str_detect(type, "critical|control")) |> 
  select(subject = 2, split, type, list, item, plural, super, basic, Value)
critical_trials

non_critical_trials <- df |> 
  filter(PennElementType == "TextInput", Parameter == "Final", type %in% c("practice", "filler")) |>
  select(subject = 2, type, item, correct, incorrect, Value)
non_critical_trials
