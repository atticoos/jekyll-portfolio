---
layout: post
title: Programming the Foundations of Life, the next age of technology
date: 2014-05-02 00:35:00
permalink: /blog/programming-foundations-life-next-age-technology
tags: []
excerpt: Programming a computer started off with punch cards, and only later did we create programming languages to write in. One day, I believe, we'll have a programming language for biotech. We're at the binary stage (DNA), but maybe one day we'll be at the high level language stage.
---

I've been thinking about this for a while now -- the advances we've made in technology, where we came from, and where we are headed. If we look at our history, we started from the Nordic Stone Age, and progressed through many stages and advancements in technology. Early on we had the Bronze Age, leading into the Iron Age, Gold Age, and into our present day ages of advanced technologies built upon expertise in physics, chemistry, information theory, quantum physics, astrophysics, anything-physics.


<img alt="ages of technology" src="/dist/images/blog/programming-foundations-life-next-age-technology/ages-of-technology.jpg" />

So what's next? There is a next, right? We'll probably see big improvements to everything we already see. I was once asked a puzzling question, what can still be invented? It's hard to think what can be invented, since it doesn't exist. It's like thinking about what other senses we could have, what other colors could be out there, what other smells may pass us by unnoticed.. What other ages of technology are to come?


The information age has brought us not just a wide variety and flavor of iPhone apps, but an infrastructure and framework as we enter the "internet of things". And lately, I feel that this does not only apply to electronics.

I think one of the next generations of technology will be biotech, in many ways. I think there will be a gradual incline into it, which is happening right now, but I think there will be a massive spike at some point, just like the Machine Age and Information Age -- once there is better and easier system and standard in place for creating things.

Remember the internet before web and mobile applications? It was boring, and basically unseen compared to how much use it gets today. And then internet applications began rising, growing, new technologies introduced, new platforms to develop on top of, and APIs becoming available. A rush of data-enriched and interconnected applications began to surface. We were given a programable interface to someone else's application! What if we were given a programable interface.. to the foundation of life?

To see this better, let's consider what code actually is. It usually comes in the form of a language for a human to interpret and write, and then is usually compiled into a "language", such as bytecode, that a computer can interpret and understand. A procedural set of instruction fed to a computer. A sequence of events, that when ran in a specific order -- and for layman's sake, let's say it's linear, then it produces some output, such as an experience in an application.

What about DNA? It's appears to be linear, it's a code, it is an instruction set for a biological entity. How is it different than our computer's code? Well, it's a collection of base pairs, uninterpretable to many (like machine code or binary), and produces something much different than software. But what did our computer code look like before it had a human-readable programming language? It was either a punch card, or assembly code. But then influence gave rise to create an interpretive language for people to work with.

If we look at an IBM punch card used for programming in the '70s and mid '80s, it's impossible, unless trained, to know its function.

<img alt="programming punch cards" src="/dist/images/blog/programming-foundations-life-next-age-technology/punchcard.jpg" />

If we look at assembly or machine code, it's impossible, unless trained, to know its function.

<img alt="machine code" src="/dist/images/blog/programming-foundations-life-next-age-technology/machine-code.gif" />

And if we look at a DNA sequence, it's impossible, unless trained, to know its function.
<img alt="DNA sequence" src="/dist/images/blog/programming-foundations-life-next-age-technology/dna.gif" />

See the pattern here? We're at the lowest level of implementation. We haven't abstracted anything away, nor built anything on top of our lowest and rawest form.

Let's look at two scenarios.

**Scenario A:** We have a sequence of instructions in assembly language that creates an application window with the text "Hello World" inside. If we were to look at this code, it would be a sequence short words in a top-down fashion that makes little sense.

**Scenario B:** We have a sequence of DNA base pairs (instructions) that creates a number of proteins that bind and react with each other, producing some type of output. If we look at this (DNA) code, there would be a sequence of letters in a a top-down fashion that makes little sense.

Well, today, Scenario A would rarely exist. It would not look like machine code if a regular programmer was typing it. It would look elegant, and would look like familiar, human-readable code. Code, in which, we could easily look at and understand we are creating an application window to display "Hello World". Code, that allows us to easily model a real-world entity with instructions describing it's makeup, its purpose, and its interaction with its surroundings.

Why can't there be a system in place for Scenario B? Well, that only seems to be because it hasn't been invented yet.

Let's look at the example below. We see there are three levels.

<img alt="compiling languages" src="/dist/images/blog/programming-foundations-life-next-age-technology/compiling.gif" />

1. **High-level Language**<br />This is our human-friendly interface to the machine. This is what we actually code with our hands.
2. **Assembly Language**<br />When we are done programming, our code gets converted into the harder-to-read stuff -- assembly language. This is what the system needs in order to create the application. **High-level Languages** are simply an interface to this. Most programming languages, at some point, become assembly language.<br />It's like communication. There are many languages, many dialects, and many ways to converse with another person. But at its lowest level, the human brain has mapped words into memories, memories into emotions, and is able to understand the sound from one persons mouth and process a thought.
3. **Machine Langauge**<br/>Machine code is what assembly code creates. It's the "assembled" code. We won't get into why this is, what it does, and how it works, but it defines how your application works on the lowest level.

As we go into each lower level, it becomes harder and harder to understand the meaning of the code. It becomes unintepretable, especially in machine code. Machine code is analogous to DNA. Imagine if DNA had a compiler.

Let's apply this to DNA.

1. **High-level Language**<br />What if you could easily model an "end result" of your DNA building blocks in a human-interpretable way?
2. **Assembly Language**<br />This would be the basic construct that all languages compile into, the common denominator of them all, used to produce the actual DNA sequences
3. **DNA sequence**<br />This is what we have today. The lowest level. This is what should be the result of the levels above.

If we wanted to model a person in code, we would have something that may look like this:

{% highlight java %}
public class Perosn {
  private Head head;
  private Torsoe torsoe;
  private Arm leftArm;
  private Arm rightArm;
  private Leg leftLeg;
  private Leg rightLeg;
}

class Head
{
  private Eyes[] eyes;
  private Nose nose;
  private Mouth mouth;
}

class Eye
{
  private String color;
  private Boolean nearSighted;
  private Integer sightStrenght;
}

class Arm
{
  private Hand hand;
}

class Hand
{
  private Finger[] fingers;
}
{% endhighlight %}

This would translate into computer code, and if we added more, we could model some behavior of a human. But what if this was meant for some biological entity? What if we were able to program in a human-readable way what proteins get created and how they develop, grow, evolve, function, and interact with each other, so that in the end we could have a "running application" when we compile it all?

I truly believe that once the genome database becomes much more understood, and new practices, research, and technologies become introduced, that it would not be farfetched to see this happen one day. We're not talking tomorrow, a few years from now, but when we look at our advancements over a timeline like above, I could see a projection of 100 years from now including this. With a system such as this in place, I think our gradual adaptation to this new technology would spike, making it much easier to create things, and we would become immersed with amazing inventions, innovations, and weird shit.
