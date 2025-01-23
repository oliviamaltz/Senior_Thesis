library(tidyverse)
library(glue)
library(googlesheets4)
nouns <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "FINAL pairs"
) %>%
  mutate(item = super, super = tolower(super), basic = tolower(basic))

cues <- c(
  "\"...Xs...\"" = "plural",
  "\"...some Xs\"" = "some",
  "\"...kind of X...\"" = "kind of",
  "\"...X...\"" = "bare singular",
  "\"...that's a(n) X...\"" = "is a",
  "\"...that's called X...\"" = "called a",
  "\"...all Xs...\"" = "all",
  "\"...Which X...\"" = "which",
  "\"...another X...\"" = "another"
)


stimuli_13 <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "Grouping 1"
)[, 1:9]
stimuli_13 <- stimuli_13 %>%
  rename_with(~ str_extract(.x, "item\\d"), contains("item")) %>%
  pivot_longer(contains("item"), names_to = "list", values_to = "item")

stimuli_46 <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "Grouping 2"
)[, 1:9]
stimuli_46 <- stimuli_46 %>%
  pivot_longer(contains("item"), names_to = "list", values_to = "item")


persons <- stimuli %>%
  distinct(nonceword) %>%
  mutate(person = paste0("person", rep(1:6, times = 4)))

stimuli <- bind_rows(first = stimuli_13, second = stimuli_46, .id = "split") %>%
  mutate(
    list = str_replace(list, "item", "list"),
    plural = str_detect(stimulus, "Xs"),
  ) %>%
  left_join(nouns, by = c("item")) %>%
  mutate(
    cue = cues[stimulus]
  ) %>%
  left_join(persons, by = c("nonceword")) %>%
  mutate(
    alien_frame_audio = glue("{person}_{nonceword}_{type}.wav"),
    cat_first_answer = rep_len(c("super", "basic"), n()),
    cat_answers_audio = glue("{item}_{ifelse(plural, 'pl', 'sg')}_{cat_first_answer}.wav"),
    .by = c(split, list)
  ) %>%
  mutate(
    rowid = row_number(),
    .by = c(split, list)
  )
write_sheet(
  stimuli,
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "template"
)

# Cat sentence list
cat_sentences <- stimuli %>%
  distinct(cat_answers_audio, item, plural, cat_first_answer, super, basic) %>%
  arrange(cat_answers_audio)
write_sheet(
  cat_sentences,
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "CatSentenceList"
)

# Speakers sentence list
speaker_sentences <- stimuli %>%
  distinct(person, nonceword, stimulus) %>%
  mutate(
    phrase = str_replace_all(stimulus, fixed("a(n)"), "a"),
    phrase = str_replace_all(phrase, "Which", "which"),
    phrase = str_remove_all(phrase, '[\\"]'),
    phrase = str_replace(phrase, "X", nonceword)
  ) %>%
  arrange(person)
write_sheet(
  speaker_sentences,
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "SpeakerSentenceList"
)

# Fillers
fillers <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "FillerList"
)
fillers <- fillers %>%
  mutate(
    alien_frame_audio = glue("filler_{nonceword}_phrases.wav"),
    cat_answers_audio = glue("filler_{nonceword}_answers.wav"),
    cat_first_answer = NA
  )
write_sheet(
  fillers,
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  "FillerList"
)
