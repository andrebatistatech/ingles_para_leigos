-- Seed: 180 questões (10 por nível × dificuldade = 18 combinações × 10)
-- Cada grupo: 8 múltipla escolha + 2 dissertativas

INSERT INTO questions (level, difficulty, type, topic, question_text, options, correct_answer, explanation, study_tip, time_limit_seconds) VALUES

-- ============================================================
-- A1 | DIFFICULTY 1 (Fácil)
-- ============================================================
('A1',1,'multiple_choice','verb_to_be','She ___ a teacher.',
 '["is","are","am","be"]','is',
 'With "she" (3rd person singular) we always use "is".',
 'Remember: I am | You are | He/She/It IS | We/They are',60),

('A1',1,'multiple_choice','verb_to_be','___ you from Brazil?',
 '["Am","Is","Are","Be"]','Are',
 '"Are" is used with "you" in questions.',
 'Question form: Am I? Are you/we/they? Is he/she/it?',60),

('A1',1,'multiple_choice','articles','I have ___ apple.',
 '["a","an","the","—"]','an',
 'Use "an" before words that start with a vowel sound (a, e, i, o, u).',
 'A + consonant sound: a cat. AN + vowel sound: an apple.',60),

('A1',1,'multiple_choice','present_simple','They ___ to school every day.',
 '["go","goes","going","gone"]','go',
 'With "they" (plural), the verb stays in base form: go.',
 'He/She/It + verb+s. I/You/We/They + base verb.',60),

('A1',1,'multiple_choice','numbers','How many days are in a week?',
 '["Five","Six","Seven","Eight"]','Seven',
 'A week has seven days: Monday to Sunday.',
 'Numbers 1-7: one, two, three, four, five, six, seven.',60),

('A1',1,'multiple_choice','colors','The sky is ___.',
 '["red","blue","green","yellow"]','blue',
 'The sky appears blue due to light scattering.',
 'Basic colors: red, blue, green, yellow, white, black, orange.',60),

('A1',1,'multiple_choice','family','My mother''s mother is my ___.',
 '["aunt","sister","grandmother","cousin"]','grandmother',
 'Your mother''s mother is your grandmother.',
 'Family: father, mother, brother, sister, grandfather, grandmother.',60),

('A1',1,'multiple_choice','greetings','You meet someone in the morning. You say:',
 '["Good night","Good afternoon","Good morning","Goodbye"]','Good morning',
 '"Good morning" is used from sunrise until noon.',
 'Morning (6am-12pm), Afternoon (12pm-6pm), Evening/Night (6pm+).',60),

('A1',1,'essay','verb_to_be','Write 2 sentences about yourself using "am", "is", or "are". Example: "I am 25 years old. My name is Ana."',
 NULL,'I am [age] years old. My name is [name].',
 'Use "am" with "I" and describe basic personal information.',
 'Practice: I am..., My name is..., I am from..., I am a...',120),

('A1',1,'essay','present_simple','Describe your daily routine in 2 sentences. Use simple present tense. Example: "I wake up at 7am. I eat breakfast at home."',
 NULL,'I wake up at [time]. I [verb] every day.',
 'Simple present describes regular actions and routines.',
 'Time expressions: every day, in the morning, at night, always, usually.',120),

-- ============================================================
-- A1 | DIFFICULTY 2 (Médio)
-- ============================================================
('A1',2,'multiple_choice','present_simple','He ___ coffee every morning.',
 '["drink","drinks","drinking","drinked"]','drinks',
 'He is 3rd person singular, so we add -s to the verb.',
 'Rules: go→goes, do→does, have→has, watch→watches.',60),

('A1',2,'multiple_choice','prepositions','The book is ___ the table.',
 '["in","on","at","under"]','on',
 '"On" indicates something is on top of a surface.',
 'On = surface. In = inside. Under = below. Next to = beside.',60),

('A1',2,'multiple_choice','present_simple','___ she like pizza?',
 '["Do","Does","Is","Are"]','Does',
 'Use "Does" for he/she/it in present simple questions.',
 'Do I/you/we/they like...? Does he/she/it like...?',60),

('A1',2,'multiple_choice','negatives','I ___ like vegetables.',
 '["don''t","doesn''t","isn''t","aren''t"]','don''t',
 '"Don''t" is the negative for I/you/we/they in present simple.',
 'I/You/We/They + don''t. He/She/It + doesn''t.',60),

('A1',2,'multiple_choice','time','What time is it? It is ___.',
 '["three o''clock","three hours","three time","third clock"]','three o''clock',
 '"O''clock" is used with exact hours: 3:00, 5:00, etc.',
 'Telling time: 3:00 = three o''clock. 3:30 = half past three.',60),

('A1',2,'multiple_choice','food','I want ___ water, please.',
 '["a","an","some","many"]','some',
 '"Some" is used with uncountable nouns like water, milk, bread.',
 'Countable: a/an/some apples. Uncountable: some water/milk/rice.',60),

('A1',2,'multiple_choice','weather','It is ___ today. Take your umbrella.',
 '["sunny","hot","raining","windy"]','raining',
 '"Raining" indicates rain is currently falling — use umbrella.',
 'Weather: sunny, cloudy, rainy, windy, snowy, hot, cold.',60),

('A1',2,'multiple_choice','imperatives','___ quiet in the library.',
 '["Be","Are","Is","Am"]','Be',
 '"Be" is the imperative form for commands and instructions.',
 'Imperatives use the base verb: Be quiet! Sit down! Open your book!',60),

('A1',2,'essay','present_simple','Describe what you eat for breakfast. Write 2-3 sentences. Example: "I eat bread and drink coffee. I don''t eat eggs."',
 NULL,'I eat/drink [food/drink] for breakfast. I don''t eat [food].',
 'Use present simple for habits. Use "don''t" for negatives.',
 'Food vocabulary: eggs, bread, milk, juice, coffee, fruit, cereal.',120),

('A1',2,'essay','family','Write about 2 members of your family. Use "is" and "has". Example: "My brother is 20 years old. He has brown hair."',
 NULL,'My [family member] is [age/adjective]. He/She has [characteristic].',
 'Use "is" for descriptions and "has" for possessions/physical traits.',
 'Family + adjectives: My sister is tall. My father is 50 years old.',120),

-- ============================================================
-- A1 | DIFFICULTY 3 (Difícil)
-- ============================================================
('A1',3,'multiple_choice','present_simple','My sister ___ to music every night.',
 '["listen","listens","listening","listened"]','listens',
 'Third person singular (my sister = she) needs -s: listens.',
 'Spelling: listen→listens, go→goes, study→studies, have→has.',60),

('A1',3,'multiple_choice','negatives','She ___ have a car.',
 '["don''t","doesn''t","isn''t","not"]','doesn''t',
 '"Doesn''t" is the negative auxiliary for he/she/it.',
 'He/She/It doesn''t + base verb. NOT "doesn''t has" — use "have".',60),

('A1',3,'multiple_choice','prepositions','I go to school ___ 8 o''clock.',
 '["in","on","at","by"]','at',
 '"At" is used with specific times: at 8 o''clock, at noon.',
 'Time prepositions: AT + time, ON + day, IN + month/year.',60),

('A1',3,'multiple_choice','this_that','___ are my friends.',
 '["This","That","These","Those"]','These',
 '"These" is the plural of "this" — used for nearby people/things.',
 'Near: this (sing.) / these (plur.). Far: that (sing.) / those (plur.).',60),

('A1',3,'multiple_choice','can','___ you speak English?',
 '["Can","Do","Are","Have"]','Can',
 '"Can" expresses ability. "Can you...?" is how we ask about abilities.',
 'Can = ability/permission. Can you swim? Yes, I can. No, I can''t.',60),

('A1',3,'multiple_choice','have_got','I ___ two brothers.',
 '["have got","has got","am","is"]','have got',
 '"Have got" = "have" — used for possession. I/you/we/they = have got.',
 'I/You/We/They have got. He/She/It has got.',60),

('A1',3,'multiple_choice','ordinal_numbers','January is the ___ month of the year.',
 '["one","first","once","oneth"]','first',
 'Ordinal numbers: first, second, third, fourth, fifth...',
 '1st=first, 2nd=second, 3rd=third, 4th=fourth, 5th=fifth.',60),

('A1',3,'multiple_choice','there_is','___ a bank near here?',
 '["Is there","Are there","There is","There are"]','Is there',
 '"Is there" is used to ask about a single uncountable/singular noun.',
 'Is there a...? (singular). Are there any...? (plural).',60),

('A1',3,'essay','can_ability','Write 3 things you can do and 1 thing you cannot do. Example: "I can swim and cook. I can also drive. I can''t play piano."',
 NULL,'I can [activity]. I can also [activity]. I can''t [activity].',
 '"Can" for ability. "Can''t" = cannot. Use base verb after can.',
 'Skills: swim, cook, drive, sing, dance, draw, speak English.',120),

('A1',3,'essay','present_simple','Describe your house or apartment in 3 sentences. Use "there is/are" and "have". Example: "My house has 3 rooms. There is a kitchen and a living room."',
 NULL,'My house has [number] rooms. There is/are [rooms/furniture].',
 'There is + singular. There are + plural. Have for possession.',
 'Rooms: bedroom, bathroom, kitchen, living room, garden.',120),

-- ============================================================
-- A2 | DIFFICULTY 1 (Fácil)
-- ============================================================
('A2',1,'multiple_choice','past_simple','Yesterday I ___ to the supermarket.',
 '["go","goes","went","gone"]','went',
 '"Went" is the irregular past tense of "go".',
 'Irregular verbs: go→went, come→came, buy→bought, eat→ate.',60),

('A2',1,'multiple_choice','past_simple','She ___ a letter last week.',
 '["write","writes","wrote","written"]','wrote',
 '"Wrote" is the irregular past tense of "write".',
 'Regular past: +ed (worked, played). Irregular: write→wrote.',60),

('A2',1,'multiple_choice','present_continuous','Look! It ___ outside.',
 '["rains","rain","is raining","rained"]','is raining',
 'Present Continuous (is + -ing) describes actions happening right now.',
 'Right now / at the moment → Present Continuous: is/am/are + verb-ing.',60),

('A2',1,'multiple_choice','going_to','I ___ visit my grandmother tomorrow.',
 '["go to","goes to","am going to","will going to"]','am going to',
 '"Am going to" expresses a planned future action.',
 'Plans: I am going to... He is going to... They are going to...',60),

('A2',1,'multiple_choice','comparatives','A car is ___ than a bicycle.',
 '["fast","faster","more fast","fastest"]','faster',
 'Short adjectives: add -er to compare. fast → faster.',
 'Short adj: fast→faster, big→bigger. Long adj: more expensive.',60),

('A2',1,'multiple_choice','past_simple','Did you ___ the movie last night?',
 '["watched","watch","watches","watching"]','watch',
 'After "Did" in questions, use the base form of the verb.',
 'Did + subject + base verb? Did you go? Did she eat?',60),

('A2',1,'multiple_choice','past_simple','They ___ not go to the party.',
 '["did","does","do","was"]','did',
 '"Did not (didn''t)" is the negative for all subjects in past simple.',
 'Negative past: I/you/he/she/we/they + didn''t + base verb.',60),

('A2',1,'multiple_choice','present_continuous','She ___ a book right now.',
 '["reads","read","is reading","was reading"]','is reading',
 '"Is reading" = present continuous, for actions happening now.',
 'Am/Is/Are + verb+ing = happening at this moment.',60),

('A2',1,'essay','past_simple','Write about what you did last weekend. Use past simple tense. Write at least 2 sentences. Example: "Last Saturday I went to the park. I played football with my friends."',
 NULL,'Last [day] I [past verb]. I also [past verb].',
 'Past Simple = completed actions in the past. Use time markers like last, yesterday, ago.',
 'Time markers: yesterday, last week, last Saturday, two days ago.',120),

('A2',1,'essay','going_to','Write about your plans for next weekend. Use "going to". Write 2-3 sentences. Example: "Next weekend I am going to visit my family. We are going to have dinner together."',
 NULL,'Next [time] I am going to [activity]. I am also going to [activity].',
 '"Going to" is for plans and intentions decided before speaking.',
 'Going to: I am, you are, he/she is, we/they are + going to + base verb.',120),

-- ============================================================
-- A2 | DIFFICULTY 2 (Médio)
-- ============================================================
('A2',2,'multiple_choice','past_simple','I ___ very tired after work yesterday.',
 '["was","were","am","be"]','was',
 '"Was" is the past form of "am/is". Used with I/he/she/it.',
 'Past of "be": I/He/She/It WAS. You/We/They WERE.',60),

('A2',2,'multiple_choice','comparatives','This exercise is ___ than the last one.',
 '["more difficult","difficulter","more difficultly","difficult more"]','more difficult',
 'Long adjectives (3+ syllables) use "more" to compare.',
 'Long: more beautiful, more difficult, more expensive.',60),

('A2',2,'multiple_choice','superlatives','Mount Everest is the ___ mountain in the world.',
 '["higher","more high","highest","most high"]','highest',
 'Superlatives with short adjectives: the + adj + -est.',
 'Short: the tallest, the fastest. Long: the most beautiful.',60),

('A2',2,'multiple_choice','countable','There aren''t ___ eggs in the fridge.',
 '["some","any","much","a"]','any',
 '"Any" is used in negative sentences and questions with countable nouns.',
 'Some (positive) → Any (negative/question): some eggs → any eggs.',60),

('A2',2,'multiple_choice','present_continuous','We ___ a party next Saturday.',
 '["are organizing","organize","organized","will organizing"]','are organizing',
 'Present continuous can describe fixed future plans.',
 'Fixed plans: I am meeting him tomorrow. We are leaving on Friday.',60),

('A2',2,'multiple_choice','past_simple','How long ___ you in London?',
 '["did","were","was","have"]','were',
 '"Were you" is the past question form for "you".',
 'Past of "be" questions: Was I/he/she/it? Were you/we/they?',60),

('A2',2,'multiple_choice','adverbs','She sings very ___.',
 '["beautiful","beautifully","more beautiful","beauty"]','beautifully',
 'Adverbs modify verbs. Most adjectives → adverb by adding -ly.',
 'Adjective → Adverb: quick→quickly, beautiful→beautifully, bad→badly.',60),

('A2',2,'multiple_choice','can_could','When I was a child, I ___ run very fast.',
 '["can","could","am able","will"]','could',
 '"Could" is the past form of "can" for past abilities.',
 'Can (present ability) → Could (past ability).',60),

('A2',2,'essay','past_simple','Write about a holiday or trip you took. Use past simple. Write 3 sentences. Example: "Last summer I went to the beach. I swam in the sea and ate seafood."',
 NULL,'Last [time] I went to [place]. I [past verb] and [past verb].',
 'Describe past experiences with irregular and regular verbs.',
 'Travel vocabulary: went, visited, stayed, ate, saw, met, bought.',120),

('A2',2,'essay','comparatives','Compare two cities or places you know. Use comparatives. Example: "São Paulo is bigger than Curitiba. But Curitiba is cleaner than São Paulo."',
 NULL,'[Place A] is [comparative adjective] than [Place B]. But [Place B] is [comparative].',
 'Comparatives contrast two things. Add -er or use "more".',
 'Adjectives: big→bigger, small→smaller, expensive→more expensive.',120),

-- ============================================================
-- A2 | DIFFICULTY 3 (Difícil)
-- ============================================================
('A2',3,'multiple_choice','past_continuous','I ___ TV when the phone rang.',
 '["watched","was watching","am watching","watch"]','was watching',
 'Past Continuous (was/were + -ing) = action in progress when interrupted.',
 'Was/Were + verb-ing: I was sleeping when the alarm rang.',60),

('A2',3,'multiple_choice','will_future','I think it ___ rain tomorrow.',
 '["is going to","will","rains","rained"]','will',
 '"Will" is used for predictions and spontaneous decisions.',
 'Will = prediction/spontaneous. Going to = plan/intention.',60),

('A2',3,'multiple_choice','must','You ___ wear a seatbelt in the car. It''s the law.',
 '["should","can","must","might"]','must',
 '"Must" expresses strong obligation or necessity.',
 'Must = strong obligation. Should = advice. Can = ability/permission.',60),

('A2',3,'multiple_choice','present_perfect_intro','I have ___ this movie before.',
 '["saw","see","seen","seeing"]','seen',
 'Present Perfect uses have/has + past participle. See→seen.',
 'Participles: see→seen, go→gone, eat→eaten, do→done.',60),

('A2',3,'multiple_choice','connectors','I like coffee, ___ I don''t drink it at night.',
 '["and","but","so","because"]','but',
 '"But" connects two contrasting ideas.',
 'And = addition. But = contrast. So = result. Because = reason.',60),

('A2',3,'multiple_choice','questions_past','Where ___ you born?',
 '["did","were","was","have"]','were',
 '"Were you born" is the fixed expression for asking place of birth.',
 'Where were you born? I was born in [city/country].',60),

('A2',3,'multiple_choice','frequency','She ___ goes to the gym.',
 '["never","ever","always","sometimes"]','sometimes',
 '"Sometimes" = occasionally (not always, not never).',
 'Frequency order: always (100%) > usually > often > sometimes > rarely > never (0%).',60),

('A2',3,'multiple_choice','too_enough','This coffee is ___ hot to drink.',
 '["enough","too","very","so"]','too',
 '"Too" means more than what is needed or comfortable.',
 'Too + adjective = problem. Adjective + enough = sufficient.',60),

('A2',3,'essay','past_continuous','Describe what you were doing at 8pm yesterday. Write 2-3 sentences. Use past continuous. Example: "At 8pm yesterday I was watching TV. My family was having dinner."',
 NULL,'At [time] yesterday I was [verb-ing]. [Person] was [verb-ing].',
 'Past Continuous = action in progress at a specific past time.',
 'At + time + I was + verb-ing. Was/Were + subject + verb-ing?',120),

('A2',3,'essay','will_future','Write about 3 predictions for the future. Use "will". Example: "In 50 years, people will live on Mars. Robots will do most jobs."',
 NULL,'In the future, [subject] will [verb]. [Subject] will also [verb].',
 '"Will" for predictions about the future, often with "I think/believe".',
 'I think... will. Probably... will. Maybe... will.',120),

-- ============================================================
-- B1 | DIFFICULTY 1 (Fácil)
-- ============================================================
('B1',1,'multiple_choice','present_perfect','I ___ never been to Japan.',
 '["have","has","had","did"]','have',
 'Present Perfect with "never" for life experiences: have + never + past participle.',
 'I have never... He has never... They have never...',60),

('B1',1,'multiple_choice','present_perfect','She ___ already finished her homework.',
 '["have","has","had","did"]','has',
 '"Has" is used with he/she/it in Present Perfect.',
 'Have (I/you/we/they) vs Has (he/she/it) + past participle.',60),

('B1',1,'multiple_choice','first_conditional','If it rains tomorrow, we ___ stay home.',
 '["will","would","won''t","can"]','will',
 'First Conditional: If + present simple, will + base verb.',
 'Real/possible future: If + present, will + base verb.',60),

('B1',1,'multiple_choice','modal_should','You look tired. You ___ get some rest.',
 '["must","should","will","can"]','should',
 '"Should" gives advice or a recommendation.',
 'Should = advice. Must = strong obligation. Could = suggestion.',60),

('B1',1,'multiple_choice','relative_clauses','That''s the woman ___ works at the hospital.',
 '["which","what","who","whose"]','who',
 '"Who" is used in relative clauses to refer to people.',
 'Who = people. Which = things. Where = places. Whose = possession.',60),

('B1',1,'multiple_choice','present_perfect','How long ___ you lived here?',
 '["did","do","have","had"]','have',
 '"Have you... for/since" is used with Present Perfect for duration.',
 'How long have you...? I have lived here for 5 years / since 2019.',60),

('B1',1,'multiple_choice','for_since','I have worked here ___ three years.',
 '["since","for","ago","during"]','for',
 '"For" is used with a period of time (3 years, 2 months).',
 'For + duration (3 years). Since + point in time (2020, Monday).',60),

('B1',1,'multiple_choice','past_continuous','While I ___ lunch, my boss called.',
 '["had","was having","have","am having"]','was having',
 '"While + past continuous" = background action interrupted by past simple.',
 'While + was/were + -ing (background), past simple (interruption).',60),

('B1',1,'essay','present_perfect','Write about 3 experiences you have had in your life. Use Present Perfect. Example: "I have visited Paris twice. I have eaten sushi. I have never driven a car."',
 NULL,'I have [past participle]... I have never [past participle]...',
 'Present Perfect for life experiences: have/has + past participle.',
 'Use "ever" in questions, "never" in negatives, "already/yet" for completion.',120),

('B1',1,'essay','first_conditional','Write 3 first conditional sentences about your plans or worries. Example: "If I pass the exam, I will celebrate. If it snows, I won''t go out."',
 NULL,'If [present simple], [subject] will/won''t [base verb].',
 'First Conditional = real/possible future situations.',
 'If + present simple, will/won''t + base verb. (NOT "will" in if-clause)',120),

-- ============================================================
-- B1 | DIFFICULTY 2 (Médio)
-- ============================================================
('B1',2,'multiple_choice','present_perfect','I haven''t seen that film ___.',
 '["already","yet","still","ever"]','yet',
 '"Yet" is used in negatives and questions with Present Perfect.',
 'Already (positive): I''ve already seen it. Yet (negative/question): I haven''t seen it yet.',60),

('B1',2,'multiple_choice','second_conditional','If I ___ a million dollars, I would travel the world.',
 '["have","had","will have","would have"]','had',
 'Second Conditional: If + past simple, would + base verb. Hypothetical.',
 'Second Conditional = hypothetical/unlikely: If I had..., I would...',60),

('B1',2,'multiple_choice','passive_voice','This bridge ___ in 1850.',
 '["built","was built","builds","is building"]','was built',
 'Passive voice past: was/were + past participle.',
 'Active: Workers built the bridge. Passive: The bridge was built.',60),

('B1',2,'multiple_choice','reported_speech_intro','He said he ___ tired.',
 '["is","was","were","has been"]','was',
 'Reported speech shifts tense back: is → was.',
 'Direct: "I am tired." Reported: He said he was tired.',60),

('B1',2,'multiple_choice','modals','You ___ smoke in hospitals.',
 '["mustn''t","shouldn''t","couldn''t","mightn''t"]','mustn''t',
 '"Mustn''t" expresses prohibition — it is forbidden.',
 'Mustn''t = prohibition. Don''t have to = no obligation (but allowed).',60),

('B1',2,'multiple_choice','present_perfect_continuous','I ___ studying for 3 hours.',
 '["have been","has been","am","was"]','have been',
 'Present Perfect Continuous: have/has been + -ing. Duration of ongoing action.',
 'I have been working/studying/waiting for + time period.',60),

('B1',2,'multiple_choice','relative_clauses','The book ___ I borrowed was very interesting.',
 '["who","whose","which","what"]','which',
 '"Which" introduces relative clauses about things.',
 'Who = people, which/that = things, where = places, whose = possession.',60),

('B1',2,'multiple_choice','first_conditional','Unless you hurry, you ___ miss the bus.',
 '["will","would","won''t","can''t"]','will',
 '"Unless" = "if not". Unless you hurry = If you don''t hurry.',
 'Unless + positive present = if not. Same result as negative condition.',60),

('B1',2,'essay','second_conditional','Write about what you would do if you won the lottery. Use Second Conditional. Write 3-4 sentences. Example: "If I won the lottery, I would buy a house. I would also travel to Japan."',
 NULL,'If I won [amount], I would [action]. I would also [action]. I wouldn''t [action].',
 'Second Conditional for hypothetical/imaginary situations.',
 'If + past simple, would + base verb. Could/might also possible.',120),

('B1',2,'essay','passive_voice','Write 3 sentences about things that were invented or built in history. Use passive voice. Example: "The telephone was invented in 1876. The Great Wall was built in China."',
 NULL,'[Object] was/were [past participle] in [time/place] by [agent].',
 'Passive voice: be + past participle. Agent introduced with "by".',
 'Was/were + past participle: was invented, was written, were built.',120),

-- ============================================================
-- B1 | DIFFICULTY 3 (Difícil)
-- ============================================================
('B1',3,'multiple_choice','present_perfect','I have lived in this city ___ 2015.',
 '["for","since","ago","during"]','since',
 '"Since" is used with a specific point in time (year, day, event).',
 'Since + starting point: since 2015, since Monday, since I was a child.',60),

('B1',3,'multiple_choice','second_conditional','If she ___ harder, she would get better results.',
 '["studies","studied","will study","would study"]','studied',
 'In Second Conditional, the if-clause uses past simple.',
 'If + past simple, would + base verb. NOT would in both clauses.',60),

('B1',3,'multiple_choice','third_conditional','If he ___ the map, he wouldn''t have got lost.',
 '["checked","has checked","had checked","would check"]','had checked',
 'Third Conditional: If + had + past participle. Past regret/impossible.',
 'Third Conditional: If + had + pp, would have + pp. For past regrets.',60),

('B1',3,'multiple_choice','phrasal_verbs','Can you ___ the music? It''s too loud.',
 '["turn down","turn up","turn off","turn into"]','turn down',
 '"Turn down" means to reduce the volume or intensity.',
 'Turn up = increase volume. Turn down = decrease. Turn off = stop.',60),

('B1',3,'multiple_choice','reported_speech','She told me she ___ going to the party.',
 '["is","was","has been","would be"]','was',
 'Reported speech: present → past. "is" becomes "was".',
 'Tense shift: is→was, am→was, will→would, can→could.',60),

('B1',3,'multiple_choice','modal_perfect','You ___ called me. I was worried.',
 '["should have","must have","could","would"]','should have',
 '"Should have + past participle" = criticism of past action.',
 'Should have + pp = you didn''t do it but it was the right thing.',60),

('B1',3,'multiple_choice','passive_voice','The report ___ by the manager tomorrow.',
 '["will write","will be written","is writing","writes"]','will be written',
 'Future passive: will be + past participle.',
 'Passive tenses: is written (present), was written (past), will be written (future).',60),

('B1',3,'multiple_choice','linking_words','___ the rain, we decided to have the picnic.',
 '["Despite","Although","Because of","However"]','Despite',
 '"Despite" + noun phrase shows contrast. "Despite the rain" = even though it rained.',
 'Despite + noun. Although + clause. However starts a new sentence.',60),

('B1',3,'essay','third_conditional','Write about a past regret using Third Conditional. Write 2-3 sentences. Example: "If I had studied harder, I would have passed the exam. I would have got a better grade."',
 NULL,'If I had [past participle], I would have [past participle]. I might have [action].',
 'Third Conditional = impossible to change past situations. Regrets and speculation.',
 'If + had + pp, would have + pp. Could have / might have also possible.',120),

('B1',3,'essay','phrasal_verbs','Write a paragraph about a problem you had recently and how you dealt with it. Try to use at least 2 phrasal verbs. Example: "I ran out of money last month. I had to give up my gym membership."',
 NULL,'I [phrasal verb] when/because [situation]. I decided to [phrasal verb].',
 'Phrasal verbs are common in natural English. Learn them in context.',
 'Common: run out of, give up, take up, find out, look for, deal with.',120),

-- ============================================================
-- B2 | DIFFICULTY 1 (Fácil)
-- ============================================================
('B2',1,'multiple_choice','passive_voice','The new policy ___ by the government last year.',
 '["introduced","was introduced","has introduced","introduces"]','was introduced',
 'Past passive: was/were + past participle.',
 'Passive focuses on the action, not the agent. By + agent is optional.',60),

('B2',1,'multiple_choice','reported_speech','He asked me where ___ from.',
 '["I am","am I","I was","was I"]','I was',
 'In indirect questions, word order is statement order (not question order).',
 'Reported questions: He asked where I was (NOT where was I).',60),

('B2',1,'multiple_choice','conditionals','If I ___ you, I would apologize.',
 '["am","was","were","be"]','were',
 'In Second Conditional, "were" is used for all subjects (formal).',
 '"If I were you" is a fixed phrase. Were is preferred for all subjects.',60),

('B2',1,'multiple_choice','phrasal_verbs','The meeting has been ___ until next week.',
 '["put off","put out","put on","put up"]','put off',
 '"Put off" means to postpone or delay something.',
 'Put off = postpone. Put out = extinguish. Put on = wear. Put up = erect.',60),

('B2',1,'multiple_choice','articles','___ rich should pay more taxes. (general statement)',
 '["A","The","An","—"]','The',
 '"The + adjective" refers to a group in general: the rich, the poor, the elderly.',
 'The + adjective for groups: the rich, the poor, the young, the unemployed.',60),

('B2',1,'multiple_choice','modal_verbs','She ___ have taken the wrong train — she''s very late.',
 '["must","should","would","could"]','must',
 '"Must have" = logical deduction about the past.',
 'Must have + pp = certain deduction. Might have = possibility. Can''t have = impossible.',60),

('B2',1,'multiple_choice','inversion','Never ___ I seen such a beautiful sunset.',
 '["I have","have I","had I","I had"]','have I',
 'After negative adverbs (never, rarely), auxiliary + subject (inversion).',
 'Inversion with: Never, Rarely, Seldom, Not only, Hardly ever.',60),

('B2',1,'multiple_choice','vocabulary','The government introduced new ___ to reduce pollution.',
 '["politics","political","policies","politic"]','policies',
 '"Policies" = official plans or rules. "Politics" = the system of government.',
 'Policy (pl: policies) = official rule/plan. Political = adjective.',60),

('B2',1,'essay','passive_voice','Write a short paragraph about a recent news event using passive voice. Use at least 3 passive structures. Example: "A new law was passed by the government. It was announced that taxes will be increased."',
 NULL,'[Subject] was/were [past participle]. It was announced/reported that...',
 'Passive voice in journalism: separates action from agent.',
 'Was/were + pp (past). Has been + pp (present perfect). Will be + pp (future).',120),

('B2',1,'essay','reported_speech','Report a conversation you had with a friend or colleague. Use reported speech. Write 3-4 sentences. Example: "My friend told me that she was looking for a new job. She asked me if I knew anyone who was hiring."',
 NULL,'[Person] told me that [reported clause]. [Person] asked me if/whether [reported question].',
 'Reported speech: shift tenses back and change pronouns.',
 'Said/told + that. Asked + if/whether. Tense shift: present→past, will→would.',120),

-- ============================================================
-- B2 | DIFFICULTY 2 (Médio)
-- ============================================================
('B2',2,'multiple_choice','mixed_conditional','If I had taken that job, I ___ in Paris now.',
 '["will be","would be","would have been","had been"]','would be',
 'Mixed Conditional: past condition + present/ongoing result.',
 'If + had + pp (past), would + base verb (present result).',60),

('B2',2,'multiple_choice','subjunctive','It is essential that every student ___ on time.',
 '["is","are","be","will be"]','be',
 'After expressions like "essential/important/necessary that", use bare infinitive (subjunctive).',
 'It is important/essential/vital/crucial that + subject + base verb (no s).',60),

('B2',2,'multiple_choice','advanced_passive','The suspect is said ___ left the country.',
 '["to have","to has","having","to had"]','to have',
 'Passive reporting: is said/believed/thought to have + past participle.',
 'He is said to be... (present). He is believed to have done... (past).',60),

('B2',2,'multiple_choice','cleft_sentences','___ was in 1969 that man first walked on the moon.',
 '["There","This","It","That"]','It',
 '"It was... that" = cleft sentence to emphasize a specific piece of information.',
 'It was [emphasis] that/who [rest of sentence]. Focuses attention.',60),

('B2',2,'multiple_choice','discourse_markers','___, there are advantages and disadvantages to this approach.',
 '["In conclusion","On balance","However","As a result"]','On balance',
 '"On balance" means considering everything / overall.',
 'Discourse markers: In conclusion, On balance, Nevertheless, In contrast, As a result.',60),

('B2',2,'multiple_choice','vocabulary','The scientist''s findings ___ the current theory.',
 '["challenged","challenged to","challenging","challenge of"]','challenged',
 '"Challenge" = to question or dispute. Past simple: challenged.',
 'Academic verbs: challenge, argue, suggest, demonstrate, indicate.',60),

('B2',2,'multiple_choice','phrasal_verbs','The company had to ___ 200 workers due to budget cuts.',
 '["lay off","lay down","lay out","lay into"]','lay off',
 '"Lay off" means to dismiss employees, especially for financial reasons.',
 'Lay off = dismiss. Take on = hire. Let go = release. Step down = resign.',60),

('B2',2,'multiple_choice','conditionals','Had I known about the problem, I ___ fixed it sooner.',
 '["will have","would have","could","would"]','would have',
 'Inverted Third Conditional: Had + subject + pp (no "if").',
 'Had I known = If I had known. Formal/written inversion of conditionals.',60),

('B2',2,'essay','mixed_conditionals','Write 2 mixed conditional sentences reflecting on a past decision and its current impact. Example: "If I had chosen a different career, I would be working in a different city now. My life would be completely different."',
 NULL,'If I had [pp], I would [base verb] now. My [situation] would be [different].',
 'Mixed conditionals combine past hypothetical with present result.',
 'If + had + pp, would + base verb (now/today). Shows ongoing consequences.',120),

('B2',2,'essay','debate','Choose a controversial topic (e.g. social media, technology, education) and write a balanced paragraph discussing both sides. Use discourse markers. Example: "On the one hand, social media connects people globally. On the other hand, it can lead to addiction and misinformation."',
 NULL,'On the one hand, [argument for]. On the other hand, [argument against]. Overall/On balance, [conclusion].',
 'Balanced argument structure: thesis, for, against, conclusion.',
 'Markers: On the one hand/other hand, Furthermore, Nevertheless, In conclusion.',120),

-- ============================================================
-- B2 | DIFFICULTY 3 (Difícil)
-- ============================================================
('B2',3,'multiple_choice','advanced_grammar','Not only ___ he forget my birthday, but he also missed our anniversary.',
 '["did","has","had","does"]','did',
 'Inversion after "Not only": Not only + auxiliary + subject.',
 'Not only did he... but also. Hardly had... when. No sooner had... than.',60),

('B2',3,'multiple_choice','vocabulary','The new regulations will ___ small businesses disproportionately.',
 '["affect","effect","impact on","influence of"]','affect',
 '"Affect" (verb) = to have an impact on. "Effect" (noun) = the result.',
 'Affect (verb): The rain affected our plans. Effect (noun): The effect was significant.',60),

('B2',3,'multiple_choice','passive_reporting','Experts ___ that the economy will improve next year.',
 '["say","predict","are predicting","are believed to say"]','are predicting',
 '"Experts are predicting" = active voice, present continuous for current belief.',
 'Reporting verbs: predict, claim, suggest, argue, believe, announce.',60),

('B2',3,'multiple_choice','formal_language','We regret ___ inform you that your application was unsuccessful.',
 '["to","for","that","of"]','to',
 '"Regret to + infinitive" = formal way to announce bad news.',
 'Formal: We regret to inform you. We would like to announce. Please be advised.',60),

('B2',3,'multiple_choice','idioms','The new manager really knows the ropes.',
 '["is confused","is inexperienced","knows the procedures","is strict"]','knows the procedures',
 '"Know the ropes" = be familiar with how something works.',
 'Idioms: know the ropes, hit the nail on the head, bite the bullet, break the ice.',60),

('B2',3,'multiple_choice','complex_sentences','___ tired she was, she kept working until the deadline.',
 '["Despite how","Although","However","No matter how"]','No matter how',
 '"No matter how + adjective" = regardless of the degree.',
 'No matter how tired/hard/much: expresses that something does not change the result.',60),

('B2',3,'multiple_choice','vocabulary','The committee ___ the proposal after lengthy deliberation.',
 '["approved","approved of","approving","have approved of"]','approved',
 '"Approve" (transitive) = officially agree to. No preposition needed.',
 'Approve (transitive): approve a plan. Approve of (intransitive): I approve of his methods.',60),

('B2',3,'multiple_choice','collocations','She made a ___ decision to change careers.',
 '["strong","heavy","bold","big"]','bold',
 '"Bold decision" is a natural collocation meaning brave/daring choice.',
 'Collocations with decision: make a decision, bold/tough/wise/difficult decision.',60),

('B2',3,'essay','argumentative','Write an argumentative paragraph (5-6 sentences) on whether social media does more harm than good. State your position clearly, give 2 reasons, and conclude.',
 NULL,'[Position statement]. Firstly, [reason + example]. Furthermore/Moreover, [reason]. In conclusion, [restatement].',
 'Argumentative writing: clear position, evidence, logical connectors, conclusion.',
 'Connectors: Firstly, Furthermore, Moreover, Nevertheless, In conclusion, Therefore.',120),

('B2',3,'essay','formal_email','Write a formal email (4-5 sentences) to a hotel manager complaining about a problem during your stay. Use formal language.',
 NULL,'Dear Mr/Ms [name], I am writing to bring to your attention... I would be grateful if... I look forward to hearing from you.',
 'Formal emails: formal greeting, clear purpose, polite language, formal closing.',
 'Structure: Dear..., I am writing to..., I would appreciate..., Yours sincerely/faithfully.',120),

-- ============================================================
-- C1 | DIFFICULTY 1 (Fácil)
-- ============================================================
('C1',1,'multiple_choice','inversion','Rarely ___ such dedication in a new employee.',
 '["I have seen","have I seen","I see","do I see"]','have I seen',
 'Inversion after "Rarely": auxiliary + subject + main verb.',
 'Negative adverbs requiring inversion: Rarely, Seldom, Never, Hardly, Scarcely.',60),

('C1',1,'multiple_choice','subjunctive','The board recommended that the CEO ___ immediately.',
 '["resigns","resign","to resign","would resign"]','resign',
 'Subjunctive after verbs of recommendation/suggestion: base form for all subjects.',
 'Recommend/suggest/insist/demand/require that + subject + base verb.',60),

('C1',1,'multiple_choice','advanced_vocabulary','The speaker''s argument was ___, leading many to question the evidence.',
 '["tenuous","tenacious","tentative","tedious"]','tenuous',
 '"Tenuous" = weak, unconvincing, lacking substance.',
 'Tenuous = weak. Tenacious = determined. Tentative = uncertain. Tedious = boring.',60),

('C1',1,'multiple_choice','cleft_sentences','It was the lack of funding ___ ultimately caused the project to fail.',
 '["which","who","what","that"]','that',
 '"It was... that" cleft sentence. "That" used when emphasising a noun phrase.',
 'It was [noun phrase] that... It was [person] who...',60),

('C1',1,'multiple_choice','advanced_grammar','___ the circumstances, the decision seemed justified.',
 '["In spite","Given","Despite to","However"]','Given',
 '"Given + noun" = considering / taking into account.',
 'Given the circumstances/situation. Given that + clause.',60),

('C1',1,'multiple_choice','passive_complex','The report is believed ___ significant errors.',
 '["containing","to contain","contain","to have contained"]','to contain',
 '"Is believed to contain" = passive reporting structure (present reference).',
 'Is believed/said/thought to + infinitive (present). To have + pp (past reference).',60),

('C1',1,'multiple_choice','idiomatic_language','The new strategy was seen as a ___ in the right direction.',
 '["move","step","walk","run"]','step',
 '"A step in the right direction" is a fixed idiom meaning positive progress.',
 'Fixed idioms: step in the right direction, at the forefront, on the back foot.',60),

('C1',1,'multiple_choice','discourse','The author first outlines the problem, ___ proposes solutions.',
 '["after","then","later on","then he"]','then',
 '"Then" connects sequential actions/ideas in formal writing.',
 'Discourse sequencers: first, then, subsequently, finally, in conclusion.',60),

('C1',1,'essay','academic_argument','Write a well-structured paragraph (5-6 sentences) arguing for or against the use of artificial intelligence in education. Include a clear thesis, supporting evidence, and a concluding sentence.',
 NULL,'[Thesis statement]. This is evidenced by [example/data]. Furthermore, [supporting point]. Critics argue that [counterargument]. However, [rebuttal]. In conclusion, [restatement].',
 'Academic paragraphs: topic sentence, evidence, analysis, counterargument, conclusion.',
 'Academic hedging: It could be argued, Evidence suggests, Studies indicate.',120),

('C1',1,'essay','complex_grammar','Write about a situation where you had to make a difficult professional or personal decision. Use a variety of tenses and at least one inversion or cleft sentence.',
 NULL,'It was [time/circumstance] that I faced [situation]. Had I [condition], I would have [result]. Not only did I [action], but I also [action].',
 'Advanced grammar variety: inversions, cleft sentences, mixed conditionals.',
 'Vary your grammar: cleft (It was... that), inversion (Not only did...), mixed conditional.',120),

-- ============================================================
-- C1 | DIFFICULTY 2 (Médio)
-- ============================================================
('C1',2,'multiple_choice','advanced_collocations','The new findings ___ previous assumptions about the disease.',
 '["overturned","turned over","turned back","overturned on"]','overturned',
 '"Overturn" = to reverse or invalidate (assumptions, decisions, verdicts).',
 'Academic collocations: overturn assumptions, challenge theories, refute claims.',60),

('C1',2,'multiple_choice','nominal_phrases','___ significant investment was made in infrastructure.',
 '["A considerable","A significant","Consider","An considerable"]','A considerable',
 '"Considerable" = large in size or amount. Collocation: considerable + noun.',
 'A considerable amount/number/effort. A significant development/difference.',60),

('C1',2,'multiple_choice','advanced_conditionals','___ the research been conducted properly, the results might have been different.',
 '["If","Had","Should","Were"]','Had',
 'Formal inversion of Third Conditional: Had + subject + pp (no "if").',
 'Had + subject + pp = if + subject + had + pp. Formal written English.',60),

('C1',2,'multiple_choice','register','The chairman ___ the board to accept the new proposal.',
 '["persuaded","convinced","encouraged","urged"]','urged',
 '"Urge" = strongly recommend/press someone to do something. Formal register.',
 'Formal reporting verbs: urge, advise, caution, prompt, implore, exhort.',60),

('C1',2,'multiple_choice','complex_passives','It is widely acknowledged ___ climate change poses an existential threat.',
 '["to","that","as","for"]','that',
 '"It is acknowledged/believed/accepted that + clause" = passive reporting.',
 'It is + pp that + clause: It is widely believed that... It is often argued that...',60),

('C1',2,'multiple_choice','advanced_vocabulary','His ___ attitude towards criticism earned him few allies.',
 '["dismissive","dismissing","dismissed","dismission"]','dismissive',
 '"Dismissive" = showing a lack of consideration or respect for something.',
 'Dismissive = rejecting without consideration. Adjective form of "dismiss".',60),

('C1',2,'multiple_choice','hedging','The data ___ that there is a correlation between the two variables.',
 '["shows clearly","suggests","obviously shows","proves absolutely"]','suggests',
 '"Suggests" is appropriate academic hedging — avoids overclaiming.',
 'Hedging language: suggests, indicates, implies, appears to, seems to, may/might.',60),

('C1',2,'multiple_choice','complex_grammar','No sooner ___ she left the building than it started to rain.',
 '["had","has","did","was"]','had',
 '"No sooner had + subject + pp than" = as soon as (past perfect inversion).',
 'No sooner had I arrived than... Hardly had he spoken when...',60),

('C1',2,'essay','discursive','Write a discursive essay introduction (5-6 sentences) on the impact of globalisation on cultural identity. Include a hook, background, and thesis.',
 NULL,'[Hook/provocative statement]. [Background context]. While [one perspective], it is argued that [thesis]. This essay will examine [scope].',
 'Essay introduction: hook, context, thesis, scope. Formal academic register.',
 'Hooks: rhetorical question, provocative statement, striking statistic, quote.',120),

('C1',2,'essay','critical_analysis','Analyse the strengths and weaknesses of remote work as a long-term model. Write 5-6 sentences using advanced vocabulary and varied grammar.',
 NULL,'Remote work presents several compelling advantages, notably [example]. Nevertheless, critics contend that [weakness]. Furthermore, [additional point]. On balance, [conclusion].',
 'Critical analysis: acknowledge complexity, use hedging, evaluate evidence.',
 'Analytical verbs: contend, assert, maintain, acknowledge, concede, illustrate.',120),

-- ============================================================
-- C1 | DIFFICULTY 3 (Difícil)
-- ============================================================
('C1',3,'multiple_choice','sophisticated_vocabulary','The politician''s speech was full of ___ — saying much but meaning little.',
 '["rhetoric","oratory","discourse","narration"]','rhetoric',
 '"Rhetoric" can imply persuasive language used to impress rather than inform.',
 'Rhetoric = persuasive language. Oratory = skill in public speaking.',60),

('C1',3,'multiple_choice','complex_syntax','The extent ___ this policy has succeeded remains a matter of debate.',
 '["that","to which","in which","which"]','to which',
 '"The extent to which" = how much / the degree to which.',
 'The extent to which, the degree to which, the way in which — formal relative expressions.',60),

('C1',3,'multiple_choice','advanced_grammar','It is high time the government ___ action on climate change.',
 '["takes","took","has taken","would take"]','took',
 '"It is high time + past subjunctive" expresses urgency about something overdue.',
 'It is time/high time + past simple. It''s time we left. It''s high time he apologised.',60),

('C1',3,'multiple_choice','nuance','The treaty was a ___ achievement, given the decades of conflict.',
 '["remarkable","noting","noted","noticeably"]','remarkable',
 '"Remarkable" = extraordinary, worthy of attention. Correct adjective form.',
 'Remarkable/outstanding/unprecedented achievement. Avoid confusing parts of speech.',60),

('C1',3,'multiple_choice','advanced_passive','The findings are thought ___ implications for future research.',
 '["having","to have","have","to having"]','to have',
 '"Are thought to have + noun" = passive reporting of present reference.',
 'Is/are + thought/believed/said + to + (have) + pp or noun.',60),

('C1',3,'multiple_choice','register_appropriacy','Which sentence is most appropriate for a formal academic essay?',
 '["Lots of people think climate change is a big deal.","Many scholars contend that climate change represents an existential threat.","Everyone knows climate change is really bad.","Climate change is super important nowadays."]',
 'Many scholars contend that climate change represents an existential threat.',
 'Academic writing requires formal vocabulary: scholars, contend, represent, existential.',
 'Avoid: lots of, really, super, everyone knows. Use: many/several, argue/contend, significant.',60),

('C1',3,'multiple_choice','collocations','Despite the ___ opposition, the legislation was passed.',
 '["fierce","hard","heavy","strong"]','fierce',
 '"Fierce opposition/competition/debate" is the natural collocation.',
 'Fierce + opposition/competition/debate/criticism. Strong + argument/evidence.',60),

('C1',3,'multiple_choice','complex_tenses','By the time she retires, she ___ for the company for 35 years.',
 '["will work","will have worked","has worked","would have worked"]','will have worked',
 'Future Perfect: will have + pp = completed action before a future point.',
 'By the time / by next year / by 2030 + will have + pp.',60),

('C1',3,'essay','advanced_opinion','Write a carefully argued paragraph (5-7 sentences) on whether governments should regulate social media companies. Demonstrate sophisticated vocabulary, hedging language, and complex syntax.',
 NULL,'The question of whether [topic] is a complex one. Proponents argue that [point], citing [evidence]. However, it could be contended that [counter]. Given [context], it would seem that [nuanced position].',
 'Sophisticated argument: nuanced position, hedging, counter-argument, evidence.',
 'Hedging: It could be argued, Evidence suggests, There is a case for, One might contend.',120),

('C1',3,'essay','report_writing','Write the introduction and conclusion of a short report on employee satisfaction in a hypothetical company. Use formal register and appropriate report language.',
 NULL,'Introduction: This report aims to examine... The findings are based on... Conclusion: In summary, the data indicates... It is recommended that...',
 'Report writing: formal register, impersonal constructions, clear structure.',
 'Report language: This report examines/outlines/aims to. The findings suggest. It is recommended.',120),

-- ============================================================
-- C2 | DIFFICULTY 1 (Fácil)
-- ============================================================
('C2',1,'multiple_choice','advanced_vocabulary','The author''s prose is characterised by an almost ___ precision.',
 '["surgical","scientific","sceptical","subtle"]','surgical',
 '"Surgical precision" = extremely accurate and careful. A common collocation in literary criticism.',
 'Literary collocations: surgical precision, lyrical quality, nuanced portrayal, evocative imagery.',60),

('C2',1,'multiple_choice','grammar_nuance','She looked at him as ___ she had never seen him before.',
 '["if","though","whether","that"]','if',
 '"As if" introduces a hypothetical comparison. Uses past subjunctive for unreal situations.',
 'As if/as though + past tense = unreal comparison. As if he were a stranger.',60),

('C2',1,'multiple_choice','idiom_nuance','His proposal was met with ___ enthusiasm from the committee.',
 '["scant","scarce","sparse","slight"]','scant',
 '"Scant" collocates naturally with abstract nouns: scant evidence/attention/regard/enthusiasm.',
 'Scant = barely sufficient. Collocates: scant regard, scant evidence, scant attention.',60),

('C2',1,'multiple_choice','complex_grammar','___ one may think of his methods, his results are undeniable.',
 '["Whatever","However","Whichever","Wherever"]','Whatever',
 '"Whatever one may think" = regardless of opinion. Concessive clause.',
 'Whatever/However/Wherever + subject + verb = regardless of... Concessive structure.',60),

('C2',1,'multiple_choice','register','The diplomat''s response was ___ but firm.',
 '["diplomatic","diplomatic in a way","diplomatically","as diplomatic"]','diplomatic',
 '"Diplomatic" = adjective, modifying the noun "response".',
 'Adjective after linking verb (was/seemed) or before noun: a diplomatic response.',60),

('C2',1,'multiple_choice','advanced_collocation','The scandal ___ the minister''s credibility beyond repair.',
 '["damaged","destroyed","undermined","ruined"]','undermined',
 '"Undermine credibility" is the most precise collocation for gradual damage.',
 'Undermine = gradually weaken. Collocates: undermine credibility/authority/confidence.',60),

('C2',1,'multiple_choice','syntax','The ___ of the situation was not lost on the audience.',
 '["irony","ironic","ironically","ironical"]','irony',
 '"The irony of the situation" — noun required after "the".',
 'The irony of / the significance of / the complexity of + noun phrase.',60),

('C2',1,'multiple_choice','nuance_vocabulary','His account of events was, at best, ___.',
 '["economical with the truth","economical of truth","a truth economy","an economy truth"]','economical with the truth',
 '"Economical with the truth" is an idiom meaning deliberately misleading without lying outright.',
 'Fixed expression: economical with the truth. Euphemism for misleading.',60),

('C2',1,'essay','literary_analysis','Write a short analytical paragraph (5-6 sentences) analysing the use of metaphor in a poem or literary text you know. Use sophisticated vocabulary and complex syntax.',
 NULL,'[Author] employs metaphor to [effect]. The image of [example] serves to [function]. This technique invites the reader to [interpretation]. Furthermore, [additional analysis].',
 'Literary analysis: identify technique, explain function, analyse effect on reader.',
 'Analysis verbs: employs, depicts, conveys, evokes, subverts, illuminates.',120),

('C2',1,'essay','nuanced_argument','Write a nuanced argument (5-6 sentences) on the relationship between economic growth and environmental sustainability. Acknowledge complexity and avoid oversimplification.',
 NULL,'The relationship between [X] and [Y] is far from straightforward. While [position A], it would be reductive to suggest that [simplification]. Indeed, [nuance]. What is required is [balanced view].',
 'Nuanced argument: acknowledge tension, avoid binaries, demonstrate complexity.',
 'Nuance markers: far from straightforward, it would be reductive, by no means, to a degree.',120),

-- ============================================================
-- C2 | DIFFICULTY 2 (Médio)
-- ============================================================
('C2',2,'multiple_choice','advanced_syntax','The more one studies the issue, ___ it becomes.',
 '["the complex more","complexer it becomes","the more complex","more complex"]','the more complex',
 '"The more... the more/less" = parallel comparative structure.',
 'The more + adjective, the more/less + adjective. Proportional comparisons.',60),

('C2',2,'multiple_choice','subtle_vocabulary','The critic offered a ___ appraisal of the novel.',
 '["penetrating","penetrative","penetrated","penetrant"]','penetrating',
 '"A penetrating appraisal/analysis/critique" = insightful and thorough.',
 'Penetrating insight/analysis/criticism/question. Not "penetrative" in this context.',60),

('C2',2,'multiple_choice','complex_grammar','Not until the evidence was presented ___ the jury change its verdict.',
 '["they did","did they","had they","were they"]','did they',
 'Fronted negative: "Not until + clause" triggers inversion in main clause.',
 'Not until / Not since / Not for one moment + did/had/was + subject.',60),

('C2',2,'multiple_choice','ambiguity','Visiting relatives can be ___.',
 '["boring or fun","two meanings","a grammar lesson","an ambiguous phrase"]','a grammar lesson',
 '"Visiting relatives" is a classic grammatical ambiguity: relatives who visit OR the act of visiting relatives.',
 'Structural ambiguity arises when a phrase allows multiple syntactic interpretations.',60),

('C2',2,'multiple_choice','advanced_vocabulary','The legislation was criticised for its ___ approach to data privacy.',
 '["cavalier","casual","careless","nonchalant"]','cavalier',
 '"Cavalier" = showing a lack of proper concern, dismissively careless.',
 'Cavalier attitude/approach/disregard. Stronger than casual, implies recklessness.',60),

('C2',2,'multiple_choice','formal_syntax','It is imperative that measures ___ taken without delay.',
 '["are","were","be","will be"]','be',
 'After "imperative/essential/vital that", use bare infinitive (subjunctive).',
 'Subjunctive after: imperative, essential, crucial, vital, necessary that + base verb.',60),

('C2',2,'multiple_choice','nuanced_collocation','The professor''s lecture shed new ___ on the subject.',
 '["light","insight","clarity","view"]','light',
 '"Shed light on" = illuminate, clarify. A fixed idiomatic expression.',
 'Fixed: shed light on, cast doubt on, raise awareness of, draw attention to.',60),

('C2',2,'multiple_choice','style','Which choice best continues the formal academic register? "While economic growth remains desirable, ___ that environmental degradation may ultimately undermine its very foundations."',
 '["there''s no doubt","it''s clear","one cannot ignore the possibility","everyone can see"]','one cannot ignore the possibility',
 '"One cannot ignore the possibility" maintains formal, impersonal academic register.',
 'Academic register: impersonal constructions, hedging, formal vocabulary.',60),

('C2',2,'essay','critical_discourse','Write a critical analysis (5-7 sentences) of how language is used to shape public opinion on a political issue of your choice. Use discourse analysis terminology where appropriate.',
 NULL,'[Political discourse] employs [linguistic feature] to [effect on audience]. The use of [example] serves to [normalise/delegitimise/frame] [issue]. This rhetorical strategy positions [group] as [role].',
 'Critical discourse analysis: examine lexical choices, framing, presupposition, modality.',
 'Discourse terms: framing, presupposition, hedging, modality, binary opposition, othering.',120),

('C2',2,'essay','synthesis','Drawing on at least two different perspectives, write a synthesised argument (6-8 sentences) on whether the concept of national identity is still relevant in a globalised world.',
 NULL,'From a [perspective], national identity serves to [function]. Conversely, [alternative perspective] contends that [argument]. Synthesising these views, one might argue that [nuanced position].',
 'Synthesis: integrate multiple perspectives, show relationship between views, arrive at nuanced position.',
 'Synthesis language: while X argues..., Y contends..., taken together, these perspectives suggest...',120),

-- ============================================================
-- C2 | DIFFICULTY 3 (Difícil)
-- ============================================================
('C2',3,'multiple_choice','literary_language','The novel employs a ___ narrator whose account we are encouraged to question.',
 '["unreliable","untrustworthy","deceptive","lying"]','unreliable',
 '"Unreliable narrator" is the established literary term for a narrator whose credibility is compromised.',
 'Literary terms: unreliable narrator, stream of consciousness, intertextuality, defamiliarisation.',60),

('C2',3,'multiple_choice','advanced_grammar','___ that the proposal would fail, she nonetheless pressed ahead.',
 '["Despite knowing","Knowing well","Despite she knew","Although knowing"]','Despite knowing',
 '"Despite + gerund" = concessive structure. Despite knowing = even though she knew.',
 'Despite/In spite of + gerund or noun. Although/Even though + clause.',60),

('C2',3,'multiple_choice','connotation','Which word has the most negative connotation when describing someone''s persistence?',
 '["tenacious","dogged","stubborn","resolute"]','stubborn',
 '"Stubborn" carries negative connotation — unreasonably persistent. Others are neutral/positive.',
 'Connotation: tenacious (positive), resolute (positive), dogged (neutral), stubborn (negative).',60),

('C2',3,'multiple_choice','complex_syntax','The question is not so much whether it can be done ___ whether it should be.',
 '["as","but","than","rather than"]','as',
 '"Not so much X as Y" = the emphasis is on Y rather than X.',
 'Not so much... as: shifts the emphasis. Not so much about money as about respect.',60),

('C2',3,'multiple_choice','precise_vocabulary','The artist''s later work represents a ___ from her earlier, more optimistic style.',
 '["divergence","diversion","division","deviation"]','departure',
 '"A departure from" = a significant change from a previous approach. Common in arts criticism.',
 'A departure from = moving away from. Collocates: radical/marked/significant departure.',60),

('C2',3,'multiple_choice','advanced_register','In formal academic writing, which is most appropriate?',
 '["The data clearly proves our point.","The findings strongly support the hypothesis.","You can see from the results that we were right.","The results are obviously what we expected."]',
 'The findings strongly support the hypothesis.',
 '"Findings support the hypothesis" is precise, objective, and appropriately hedged.',
 'Avoid: clearly proves, obviously, we were right. Use: findings suggest/support/indicate.',60),

('C2',3,'multiple_choice','philosophical_vocabulary','The philosopher argued that all moral judgements are ultimately ___.',
 '["subjectful","subjected","subjective","subjectivised"]','subjective',
 '"Subjective" = based on personal feelings or opinions, not objective fact.',
 'Subjective (personal opinion) vs objective (factual). Key philosophical distinction.',60),

('C2',3,'multiple_choice','textual_coherence','The ___ of the argument is undermined by a lack of supporting evidence.',
 '["coherence","cohesion","consistency","cogency"]','cogency',
 '"Cogency" = the quality of being convincing or compelling. Specific to logical argument.',
 'Cogent = logically compelling. Coherence = logical flow. Cohesion = textual unity.',60),

('C2',3,'essay','philosophical_writing','Write a short philosophical argument (6-7 sentences) on whether free will exists. Draw on at least one philosophical concept or thinker. Use precise, sophisticated language.',
 NULL,'The question of free will has occupied philosophers since [thinker/period]. [Compatibilist/Determinist/Libertarian] theorists contend that [position]. [Counter-position]. What this debate ultimately reveals is [insight].',
 'Philosophical writing: precise terminology, structured argument, acknowledge counterposition.',
 'Concepts: determinism, compatibilism, autonomy, agency, causality, moral responsibility.',120),

('C2',3,'essay','high_register_critique','Write a review paragraph (6-8 sentences) of a film, book, or cultural event you know well. Aim for the register of a high-quality publication such as The Guardian or The New Yorker.',
 NULL,'[Work] is at once [quality 1] and [quality 2]. [Author/Director] demonstrates an assured grasp of [technique/theme]. Particularly striking is [specific element], which [effect]. The result is a work that [overall evaluation].',
 'Review writing: balanced assessment, specific examples, sophisticated vocabulary, distinct voice.',
 'Review language: at once, assured, particularly striking, nuanced, resonant, compelling, falls short.',120);
