library(tidyverse)
library(glue)
library(googlesheets4)

# 
practice <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "PracticeList"  # <-- change if your sheet is named differently
)

practice <- practice %>%
  mutate(
    alien_frame_audio = glue("practice_{nonceword}_phrases.wav"),
    cat_answers_audio = glue("practice_{nonceword}_answers.wav"),
    cat_first_answer = NA
  )

write_sheet(
  practice,
  ss = "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "PracticeList"  
)


nouns <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "FINAL pairs"
) %>%
  mutate(item = super, super = tolower(super), basic = tolower(basic))

# 3. Cues
cues <- c(
  "\"...Xs...\""     = "plural",
  "\"...some Xs\""   = "some",
  "\"...kind of X...\"" = "kind of",
  "\"...X...\""       = "bare singular",
  "\"...that's a(n) X...\"" = "is a",
  "\"...that's called X...\"" = "called a",
  "\"...all Xs...\""  = "all",
  "\"...Which X...\"" = "which",
  "\"...another X...\""= "another"
)

stimuli_13 <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "Grouping 1"
)[, 1:9]

stimuli_13 <- stimuli_13 %>%
  rename_with(~ str_extract(.x, "item\\d"), contains("item")) %>%
  pivot_longer(contains("item"), names_to = "list", values_to = "item")

stimuli_46 <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "Grouping 2"
)[, 1:9]

stimuli_46 <- stimuli_46 %>%
  pivot_longer(contains("item"), names_to = "list", values_to = "item")


stimuli <- bind_rows(
  first = stimuli_13, 
  second = stimuli_46, 
  .id = "split"
) %>%
  mutate(
    list = str_replace(list, "item", "list"),
    plural = str_detect(stimulus, "Xs")
  ) %>%
  left_join(nouns, by = "item") %>%
  mutate(cue = cues[stimulus])

# 7. Create persons table and join (assuming you have a `nonceword` column)
persons <- stimuli %>%
  distinct(nonceword) %>%
  mutate(person = paste0("person", rep(1:6, times = 4)))

stimuli <- stimuli %>%
  left_join(persons, by = "nonceword") %>%
  mutate(
    alien_frame_audio = glue("{person}_{nonceword}_{type}.wav"),
    cat_first_answer = rep_len(c("super", "basic"), n()),
    cat_answers_audio = glue("{item}_{ifelse(plural, 'pl', 'sg')}_{cat_first_answer}.wav"),
    .by = c(split, list)
  ) %>%
  group_by(split, list) %>%
  mutate(rowid = row_number()) %>%
  ungroup()

write_sheet(
  stimuli,
  ss = "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "template"
)

cat_sentences <- stimuli %>%
  distinct(cat_answers_audio, item, plural, cat_first_answer, super, basic) %>%
  arrange(cat_answers_audio)

write_sheet(
  cat_sentences,
  ss = "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "CatSentenceList"
)

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
  ss = "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "SpeakerSentenceList"
)

fillers <- read_sheet(
  "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "FillerList"
)

fillers <- fillers %>%
  mutate(
    alien_frame_audio = glue("filler_{nonceword}_phrases.wav"),
    cat_answers_audio = glue("filler_{nonceword}_answers.wav"),
    cat_first_answer = NA
  )

write_sheet(
  fillers,
  ss = "https://docs.google.com/spreadsheets/d/1ZOPY7W0tFIOx8Mhru5T3u4ZsamwljXlDN-KPeh_1MOM",
  sheet = "FillerList"
)
