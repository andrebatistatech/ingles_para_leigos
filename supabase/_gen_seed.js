// Generator for seed-full.sql — 720 questions
const fs = require('fs');
const path = require('path');

const esc = s => s.replace(/'/g, "''");
const jsonOpts = arr => "'" + JSON.stringify(arr).replace(/'/g, "''") + "'";

// Question banks per level/difficulty. Each bank provides pools we cycle through to reach 32 MC + 8 essay.
// To stay tractable we define a base set per level/difficulty and append topical variants.

const MC = (level, diff, topic, q, options, correct, expl, tip) =>
  `('${level}',${diff},'multiple_choice','${esc(topic)}','${esc(q)}',${jsonOpts(options)},'${esc(correct)}','${esc(expl)}','${esc(tip)}',60)`;

const ES = (level, diff, topic, q, example, expl, tip) =>
  `('${level}',${diff},'essay','${esc(topic)}','${esc(q)}',NULL,'${esc(example)}','${esc(expl)}','${esc(tip)}',120)`;

const rows = [];

// ---------------- A1 ----------------
// A1 D1
const a1d1_mc = [
  ['verb_to_be','I ___ a student.',['am','is','are','be'],'am','With I use am.','I am, you are, he/she/it is.'],
  ['verb_to_be','He ___ my brother.',['is','am','are','been'],'is','With he/she/it use is.','Singular he/she/it takes is.'],
  ['verb_to_be','They ___ from Brazil.',['are','is','am','be'],'are','With they use are.','Plural subjects take are.'],
  ['articles','I have ___ apple.',['an','a','the','one'],'an','Use an before vowel sounds.','a+consonant, an+vowel sound.'],
  ['articles','She is ___ teacher.',['a','an','the','-'],'a','Use a before consonant sounds.','teacher starts with a consonant sound.'],
  ['present_simple','She ___ coffee every morning.',['drinks','drink','drinking','drunk'],'drinks','Third person singular adds -s.','he/she/it + verb+s.'],
  ['present_simple','I ___ in São Paulo.',['live','lives','living','lived'],'live','With I use base form.','I/you/we/they + base verb.'],
  ['numbers','What comes after twelve?',['thirteen','thirty','twenty','three'],'thirteen','12 + 1 = 13.','Teens end in -teen.'],
  ['numbers','How do you write 20?',['twenty','twelve','twoty','twentee'],'twenty','20 is twenty.','Tens: twenty, thirty, forty...'],
  ['colors','The sky is ___.',['blue','blues','bluely','bluer'],'blue','Colors are adjectives.','Adjectives do not take -s.'],
  ['colors','Bananas are ___.',['yellow','yellows','red','blue'],'yellow','Bananas are yellow.','Learn basic color words.'],
  ['family','My father''s wife is my ___.',['mother','sister','aunt','cousin'],'mother','Father + wife = mother.','Family words: mother, father, sister, brother.'],
  ['family','My mother''s son is my ___.',['brother','uncle','father','nephew'],'brother','Mother + son = brother (if not you).','Siblings: brother, sister.'],
  ['greetings','"___ are you?" "Fine, thanks."',['How','What','Who','Where'],'How','How are you? is a greeting question.','How are you? / I am fine.'],
  ['greetings','"Good ___!" (at 9 a.m.)',['morning','night','evening','bye'],'morning','Morning greeting before noon.','morning/afternoon/evening/night.'],
  ['prepositions','The book is ___ the table.',['on','in','at','to'],'on','on = on top of a surface.','on surfaces, in containers, at points.'],
  ['prepositions','She lives ___ Brazil.',['in','on','at','by'],'in','Use in with countries.','in + country/city.'],
  ['imperatives','___ the door, please.',['Close','Closes','Closing','Closed'],'Close','Imperatives use the base form.','Imperatives: base verb.'],
  ['imperatives','Don''t ___ here.',['smoke','smokes','smoking','smoked'],'smoke','After don''t use base form.','Negative imperative: do not + base.'],
  ['there_is_are','___ a cat on the sofa.',['There is','There are','It is','They are'],'There is','Singular noun takes there is.','there is + singular, there are + plural.'],
  ['there_is_are','___ three books on the desk.',['There are','There is','It are','Have'],'There are','Plural noun takes there are.','Count the noun first.'],
  ['can','She ___ swim very well.',['can','cans','could to','is can'],'can','Modal can has no -s.','can + base verb.'],
  ['can','___ you help me?',['Can','Cans','Do can','Are'],'Can','Questions: Can + subject + verb.','Can I...? / Can you...?'],
  ['this_that','___ is my pen here.',['This','That','These','Those'],'This','This = near the speaker.','this/these near, that/those far.'],
  ['this_that','___ is your house over there.',['That','This','These','It'],'That','That = far from speaker.','Point far = that.'],
  ['present_simple','What ___ you do?',['do','does','are','is'],'do','Question with you uses do.','do + I/you/we/they.'],
  ['present_simple','She ___ not like tea.',['does','do','is','are'],'does','Third person negative: does not.','does + not + base verb.'],
  ['verb_to_be','We ___ hungry.',['are','is','am','be'],'are','With we use are.','we/you/they take are.'],
  ['articles','Open ___ window, please.',['the','a','an','-'],'the','Specific window known to both.','the = specific/known.'],
  ['plural','One child, two ___.',['children','childs','childrens','child'],'children','Irregular plural.','child -> children.'],
  ['plural','One foot, two ___.',['feet','foots','feets','footes'],'feet','Irregular plural.','foot -> feet.'],
  ['prepositions','I wake up ___ 7 a.m.',['at','in','on','by'],'at','Use at with clock times.','at + time, on + day, in + month.'],
];
const a1d1_es = [
  ['greetings','Write 2 sentences to introduce yourself (name and country).','Hello. My name is Ana. I am from Brazil.','Use basic introduction patterns.','My name is..., I am from..., Nice to meet you.'],
  ['family','Write 2 sentences about your family.','I have one sister. My father is a teacher.','Use simple present and family words.','have/has + family members, is/are + job.'],
  ['colors','Write 2 sentences about colors you like.','I like blue. My favorite color is green.','Use I like + color.','like/love + object; my favorite color is...'],
  ['numbers','Write 2 sentences with numbers (age, phone).','I am twenty years old. My number is 1234.','Use I am ... years old.','age: I am X years old.'],
  ['present_simple','Write 2 sentences about your daily routine.','I wake up at 7. I drink coffee.','Use simple present + time.','wake up, have breakfast, go to work.'],
  ['can','Write 2 sentences about things you can and cannot do.','I can swim. I cannot drive.','Use can/cannot + base verb.','can / can''t + base verb.'],
  ['there_is_are','Describe your room in 2 sentences.','There is a bed. There are two windows.','Use there is/are for descriptions.','There is + singular, There are + plural.'],
  ['greetings','Write a short greeting dialogue (2 lines).','Hi! How are you? I am fine, thanks.','Use basic greetings.','Hi, How are you, Fine thanks.'],
];
a1d1_mc.forEach(a=>rows.push(MC('A1',1,...a)));
a1d1_es.forEach(a=>rows.push(ES('A1',1,...a)));

// A1 D2
const a1d2_mc = [
  ['present_simple','He ___ TV in the evening.',['watches','watch','watching','watched'],'watches','Third person singular.','Add -es to verbs ending in -ch/-sh.'],
  ['present_simple','They ___ to school by bus.',['go','goes','going','went'],'go','Plural subject uses base form.','they/we/you + base verb.'],
  ['verb_to_be','___ you a doctor?',['Are','Is','Am','Do'],'Are','Question form with you.','Are you...? Am I...? Is he...?'],
  ['articles','The moon and ___ sun.',['the','a','an','-'],'the','Unique objects take the.','the sun, the moon, the earth.'],
  ['prepositions','The cat is ___ the box.',['in','on','at','by'],'in','in = inside.','in = inside a container.'],
  ['prepositions','We meet ___ Monday.',['on','in','at','to'],'on','Days use on.','on + day of the week.'],
  ['can','He ___ speak French.',['can''t','doesn''t can','not can','no can'],'can''t','Negative of can is can''t/cannot.','can''t = cannot.'],
  ['this_that','___ shoes are new.',['These','This','That','Is'],'These','Plural near = these.','these/those = plural.'],
  ['this_that','___ boys over there are my friends.',['Those','That','These','This'],'Those','Plural far = those.','Use those with plural far nouns.'],
  ['family','My aunt''s daughter is my ___.',['cousin','sister','niece','mother'],'cousin','Aunt''s child = cousin.','Extended family vocabulary.'],
  ['plural','One man, two ___.',['men','mans','mens','man'],'men','Irregular plural.','man -> men, woman -> women.'],
  ['plural','One mouse, two ___.',['mice','mouses','mices','mouse'],'mice','Irregular plural.','mouse -> mice.'],
  ['present_simple','Water ___ at 100°C.',['boils','boil','boiling','boiled'],'boils','General truth, 3rd person singular.','Facts use present simple.'],
  ['imperatives','Please ___ quiet.',['be','being','are','to be'],'be','Imperative of be.','Be + adjective for imperatives.'],
  ['there_is_are','How many chairs ___ there?',['are','is','have','do'],'are','Plural question form.','How many + plural + are there?'],
  ['numbers','The number 100 is ___.',['one hundred','a hundred','hundred','ten ten'],'one hundred','100 = one/a hundred.','100 = one hundred.'],
  ['colors','Grass is usually ___.',['green','red','yellow','brown'],'green','Grass color is green.','Learn nature colors.'],
  ['greetings','We say "Good night" when we ___.',['go to sleep','wake up','arrive','eat'],'go to sleep','Good night is for sleeping.','Good night = before sleep/late evening.'],
  ['verb_to_be','What ___ your name?',['is','are','am','does'],'is','Name is singular.','What is your name?'],
  ['verb_to_be','How old ___ she?',['is','are','am','do'],'is','She takes is.','How old is he/she?'],
  ['present_simple','Where ___ he live?',['does','do','is','are'],'does','Third person question.','does + subject + base verb.'],
  ['present_simple','I ___ meat.',['don''t eat','doesn''t eat','not eat','no eat'],'don''t eat','I + don''t + base.','don''t = do not.'],
  ['prepositions','She is born ___ March.',['in','on','at','by'],'in','Months take in.','in + month/year.'],
  ['prepositions','See you ___ the morning.',['in','on','at','by'],'in','in the morning/afternoon/evening.','at night but in the morning.'],
  ['articles','I eat ___ egg for breakfast.',['an','a','the','-'],'an','egg starts with vowel sound.','a/an based on sound.'],
  ['articles','He plays ___ guitar.',['the','a','an','-'],'the','Instruments take the.','play the + instrument.'],
  ['can','Birds ___ fly.',['can','cans','are can','do can'],'can','can + base verb.','Ability: can.'],
  ['this_that','What is ___?',['this','these','those','the'],'this','Singular demonstrative pronoun.','What is this/that?'],
  ['family','My parents'' parents are my ___.',['grandparents','cousins','uncles','nephews'],'grandparents','Parents of parents = grandparents.','grand = one generation up/down.'],
  ['there_is_are','___ any milk in the fridge?',['Is there','Are there','Have','Is'],'Is there','Uncountable singular form.','milk is uncountable.'],
  ['imperatives','___ worry. Everything is fine.',['Don''t','No','Not','Isn''t'],'Don''t','Negative imperative.','Don''t + base verb.'],
  ['numbers','21 is ___.',['twenty-one','twenty one','twentyone','two one'],'twenty-one','Hyphenate compound numbers 21-99.','21-99 use hyphen.'],
];
const a1d2_es = [
  ['daily_routine','Describe your morning in 3 sentences.','I wake up at 6. I drink coffee. I go to work.','Use simple present with times.','time markers: at 7, in the morning.'],
  ['family','Describe one family member in 3 sentences.','My sister is a nurse. She is 25. She likes music.','Use is + adjective/job.','he/she + is + job/age.'],
  ['can','Write 3 sentences about abilities of your friend.','My friend can play guitar. She can''t cook. She can sing.','Use can/can''t + base verb.','can/can''t for ability.'],
  ['there_is_are','Describe your kitchen in 3 sentences.','There is a fridge. There are two chairs. There is a table.','Use there is/are.','Count the items first.'],
  ['prepositions','Describe where your things are (3 sentences).','My book is on the desk. My bag is under the chair. My phone is in my pocket.','Use place prepositions.','on/in/under/next to.'],
  ['greetings','Write a short dialogue meeting someone new.','Hello. I am Marco. Nice to meet you. Where are you from?','Use polite greetings.','Nice to meet you, Where are you from.'],
  ['present_simple','Write about what you do on weekends (3 sentences).','On weekends I sleep late. I watch movies. I see my family.','Use present simple.','On Saturdays/Sundays + verb.'],
  ['colors_family','Describe the colors in your home (3 sentences).','My walls are white. My sofa is gray. My curtains are blue.','Use noun + is/are + color.','noun + be + color adjective.'],
];
a1d2_mc.forEach(a=>rows.push(MC('A1',2,...a)));
a1d2_es.forEach(a=>rows.push(ES('A1',2,...a)));

// A1 D3
const a1d3_mc = [
  ['present_simple','She ___ English and Spanish.',['speaks','speak','is speaking','spoke'],'speaks','Habitual fact, 3rd person.','Habits use present simple.'],
  ['verb_to_be','There ___ a problem with my computer.',['is','are','am','be'],'is','Singular subject.','there is + singular noun.'],
  ['articles','I saw ___ interesting film yesterday.',['an','a','the','-'],'an','interesting starts with vowel sound.','a/an by sound not letter.'],
  ['articles','My father is ___ engineer.',['an','a','the','-'],'an','engineer = vowel sound.','Jobs: a/an + job.'],
  ['prepositions','He arrives ___ the airport at 5.',['at','in','on','to'],'at','Places: at + specific point.','at + station/airport.'],
  ['prepositions','The keys are ___ my jacket.',['in','on','at','by'],'in','Inside pocket = in.','Inside containers = in.'],
  ['present_simple','Does she ___ Japanese?',['speak','speaks','speaking','spoke'],'speak','After does use base form.','does + subject + base.'],
  ['present_simple','They ___ not have a car.',['do','does','are','is'],'do','they + do not.','Plural: do not.'],
  ['can','Why ___ you come to the party?',['can''t','cannot to','don''t can','not can'],'can''t','Questions with can''t.','Why can''t + subject.'],
  ['this_that','Whose jacket is ___?',['this','these','those','is'],'this','Singular near.','Whose + noun + is/are + demonstrative.'],
  ['plural','One tooth, two ___.',['teeth','tooths','tooth','toothes'],'teeth','Irregular plural.','tooth -> teeth.'],
  ['plural','One person, several ___.',['people','persons','peoples','person'],'people','people is the normal plural.','person -> people.'],
  ['there_is_are','There ___ some apples on the table.',['are','is','have','be'],'are','apples is plural.','some + plural + are.'],
  ['imperatives','___ late for the meeting.',['Don''t be','No be','Not be','Don''t'],'Don''t be','Negative imperative of be.','Don''t be + adjective.'],
  ['numbers','The year 2025 is read as ___.',['twenty twenty-five','two thousand twenty-five','two zero two five','twenty two five'],'twenty twenty-five','Years often split in pairs.','Post-2000 years: twenty + XX.'],
  ['colors','Mix red and yellow = ___.',['orange','purple','green','pink'],'orange','Color mixing fact.','Red+yellow=orange.'],
  ['family','My brother''s daughter is my ___.',['niece','nephew','cousin','sister'],'niece','Brother''s daughter = niece.','niece(f) / nephew(m).'],
  ['greetings','A formal way to say goodbye is ___.',['Goodbye','Bye','See ya','Cya'],'Goodbye','Goodbye is formal.','Formal: Goodbye. Informal: Bye.'],
  ['verb_to_be','___ I late?',['Am','Is','Are','Do'],'Am','Question with I uses Am.','Am I + adjective?'],
  ['verb_to_be','We ___ not ready.',['are','is','am','be'],'are','We takes are.','we/you/they are.'],
  ['present_simple','He ___ to the gym twice a week.',['goes','go','going','went'],'goes','Habit + 3rd person.','go -> goes (3rd person).'],
  ['present_simple','What time ___ the shop open?',['does','do','is','are'],'does','the shop = singular.','does + singular subject.'],
  ['prepositions','We meet ___ Christmas Eve.',['on','in','at','by'],'on','Specific days use on.','on + specific day/date.'],
  ['prepositions','The party is ___ Friday night.',['on','in','at','by'],'on','Days of week use on.','on + weekday.'],
  ['articles','___ dog is barking.',['The','A','An','-'],'The','Specific dog.','the = specific item.'],
  ['articles','I need ___ umbrella.',['an','a','the','-'],'an','umbrella = vowel sound.','an + vowel sound.'],
  ['can','___ he speak three languages?',['Can','Does can','Is can','Do can'],'Can','Modal questions invert.','Can + subject + base?'],
  ['this_that','Are ___ your shoes?',['these','this','that','is'],'these','Plural near.','these = plural near.'],
  ['family','My wife''s brother is my ___.',['brother-in-law','cousin','son-in-law','uncle'],'brother-in-law','In-law for spouse''s family.','Spouse''s sibling = in-law.'],
  ['there_is_are','___ there any sugar?',['Is','Are','Have','Do'],'Is','sugar = uncountable.','Uncountables use is.'],
  ['imperatives','Always ___ your seatbelt.',['wear','wears','wearing','wore'],'wear','Imperative = base verb.','Always/Never + base verb.'],
  ['numbers','Half of 50 is ___.',['twenty-five','twenty five','fifteen','thirty five'],'twenty-five','50/2=25, hyphenated.','Compound numbers with hyphen.'],
];
const a1d3_es = [
  ['daily_routine','Describe a typical day in 4 sentences.','I wake up at 7. I work from 9 to 5. I have dinner at 7. I sleep at 11.','Use time expressions and present simple.','from X to Y, at + time.'],
  ['family','Write about 2 family members (4 sentences).','My mother is a doctor. She is 50. My brother is a student. He is 20.','Use is + job/age.','Describe with is/are.'],
  ['can','Describe 4 things you can or cannot do.','I can cook Italian food. I can''t play piano. I can drive. I can''t swim well.','Use can/cannot + base.','Vary positive and negative.'],
  ['prepositions','Describe your neighborhood (4 sentences).','There is a park near my house. The supermarket is on the corner. My school is in front of the bank. The bus stop is next to the cafe.','Use prepositions of place.','near, next to, in front of, on.'],
  ['present_simple','Describe your hobbies (4 sentences).','I play football on Saturdays. I read books at night. I watch movies on Sundays. I don''t play video games.','Mix positive and negative.','don''t + base for negative.'],
  ['greetings','Write a dialogue with 4 lines greeting a friend.','Hi Sam! How are you today? I am great, thanks. And you?','Use common greetings.','How are you? Fine thanks, and you?'],
  ['there_is_are','Describe a classroom (4 sentences).','There is a board. There are twenty chairs. There is a teacher. There are many books.','Alternate is/are.','Singular vs plural count.'],
  ['colors','Describe your clothes today (4 sentences).','My shirt is white. My pants are blue. My shoes are black. My jacket is gray.','Use subject + be + color.','singular is, plural are.'],
];
a1d3_mc.forEach(a=>rows.push(MC('A1',3,...a)));
a1d3_es.forEach(a=>rows.push(ES('A1',3,...a)));

// ---------------- A2 ----------------
// A2 D1
const a2d1_mc = [
  ['past_simple','Yesterday I ___ to the cinema.',['went','go','goes','gone'],'went','Irregular past of go.','go -> went.'],
  ['past_simple','She ___ her homework last night.',['finished','finish','finishes','finishing'],'finished','Regular past with -ed.','regular verbs + -ed.'],
  ['past_simple','They ___ not come to the party.',['did','do','was','were'],'did','Negative past: did not.','did + not + base verb.'],
  ['past_simple','___ you see the movie?',['Did','Do','Was','Were'],'Did','Past question: Did + subject.','Did + subject + base?'],
  ['present_continuous','Look! It ___ now.',['is raining','rains','rain','rained'],'is raining','Action happening now.','be + verb-ing.'],
  ['present_continuous','We ___ dinner at the moment.',['are having','have','has','having'],'are having','Now action, plural subject.','are + verb-ing.'],
  ['going_to','Tomorrow I ___ visit my aunt.',['am going to','will going','go','going'],'am going to','Future plan = be going to.','planned future = going to.'],
  ['going_to','What ___ do tonight?',['are you going to','you will','do you going','will you go'],'are you going to','Question form of going to.','be + subject + going to.'],
  ['comparatives','A car is ___ than a bike.',['faster','fast','fastest','more fast'],'faster','Short adjective + -er.','short adj + er + than.'],
  ['comparatives','This book is ___ interesting than that one.',['more','most','much','very'],'more','Long adjective uses more.','long adj: more + adj.'],
  ['superlatives','He is the ___ student in class.',['tallest','taller','tall','most tall'],'tallest','Short adj + -est.','the + adj+est.'],
  ['superlatives','It is the ___ beautiful city.',['most','more','very','much'],'most','Long adj: the most + adj.','the most + long adj.'],
  ['adverbs','She sings ___.',['beautifully','beautiful','more beautiful','beauty'],'beautifully','Adverbs modify verbs.','adj + -ly = adverb.'],
  ['adverbs','He drives ___.',['carefully','careful','care','carefuly'],'carefully','adj+ly.','careful -> carefully.'],
  ['will','I think it ___ rain tomorrow.',['will','going','is','would'],'will','Prediction = will.','will + base verb.'],
  ['must_should','You ___ drink water every day.',['should','shoulds','musts','oughts'],'should','Advice = should.','should + base.'],
  ['must_should','Drivers ___ stop at red lights.',['must','should','may','can'],'must','Obligation = must.','must = strong obligation.'],
  ['past_continuous','I ___ TV when you called.',['was watching','watched','watch','am watching'],'was watching','Past continuous for interrupted action.','was/were + verb-ing.'],
  ['past_continuous','They ___ at 8 p.m. yesterday.',['were sleeping','slept','sleep','was sleeping'],'were sleeping','Plural past continuous.','they were + verb-ing.'],
  ['present_perfect_intro','I ___ never been to Paris.',['have','has','had','am'],'have','I + have + past participle.','have/has + participle.'],
  ['present_perfect_intro','She ___ seen that movie.',['has','have','had','is'],'has','Third person singular: has.','he/she/it + has.'],
  ['connectors','I like coffee ___ I don''t like tea.',['but','and','or','so'],'but','Contrast = but.','but shows contrast.'],
  ['connectors','It was late ___ we went home.',['so','but','or','because'],'so','Result = so.','so shows result.'],
  ['countable_uncountable','How ___ water do you drink?',['much','many','some','any'],'much','Uncountable uses much.','much + uncountable.'],
  ['countable_uncountable','How ___ books do you have?',['many','much','any','some'],'many','Countable plural uses many.','many + countable plural.'],
  ['past_simple','Where ___ you yesterday?',['were','was','did','are'],'were','you + were.','was (I/he/she/it), were (you/we/they).'],
  ['past_simple','He ___ at home last night.',['was','were','is','did'],'was','Singular subject.','he/she/it was.'],
  ['present_continuous','Why ___ you crying?',['are','do','is','does'],'are','you + are.','Question: be + subject + -ing.'],
  ['going_to','Look at those clouds! It ___ rain.',['is going to','will','rains','rained'],'is going to','Evidence-based prediction.','See evidence -> going to.'],
  ['comparatives','My bag is ___ than yours.',['heavier','heavy','heaviest','more heavy'],'heavier','y -> ier.','adj ending in y: y->i+er.'],
  ['superlatives','This is the ___ day of my life.',['best','better','goodest','most good'],'best','good -> best (irregular).','good/better/best.'],
  ['adverbs','He speaks English ___.',['fluently','fluent','fluence','fluents'],'fluently','Adverb form.','fluent -> fluently.'],
];
const a2d1_es = [
  ['past_simple','Write about what you did last weekend (3 sentences).','I went to the park. I met my friends. We played football.','Use past simple verbs.','go->went, meet->met, play->played.'],
  ['going_to','Write 3 sentences about your plans for next week.','I am going to visit my grandmother. I am going to study English. I am going to cook pasta.','Use be going to + base verb.','be going to for plans.'],
  ['comparatives','Compare two cities you know (3 sentences).','São Paulo is bigger than Rio. Rio is more beautiful than São Paulo. São Paulo is noisier than Rio.','Use comparatives.','short+er, long: more+adj.'],
  ['present_continuous','Describe what people around you are doing (3 sentences).','My sister is reading a book. My dog is sleeping. My neighbor is washing his car.','Use present continuous.','be + -ing.'],
  ['must_should','Give 3 pieces of health advice.','You should exercise every day. You must not smoke. You should eat vegetables.','Use should/must.','should for advice, must for strong rules.'],
  ['past_continuous','Describe what you were doing yesterday at 8 p.m. (3 sentences).','I was watching TV at 8. My brother was studying. My mom was cooking dinner.','Use past continuous.','was/were + -ing.'],
  ['will','Make 3 predictions about the future.','Cars will fly one day. People will live longer. We will travel to Mars.','Use will + base.','will for predictions.'],
  ['connectors','Write 3 sentences using but, so, because.','I wanted to go out but it rained. It was late so I stayed home. I was tired because I worked all day.','Use linking words.','but contrast, so result, because reason.'],
];
a2d1_mc.forEach(a=>rows.push(MC('A2',1,...a)));
a2d1_es.forEach(a=>rows.push(ES('A2',1,...a)));
