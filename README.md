# Neptunium

Small CQRS / Event Sourcing framework in JavaScript.

Like [Plutonium](https://github.com/cucumber-ltd/plutonium), Neptunium has also been extracted from Cucumber Pro.

Neptunium differs from Plutonium in that it is immediately consistent when it's using in-memory messaging.
(Read models are immediately consistent after dispatching a command).
Implementation-wise this is possible because Neptunium doesn't use streams or `process.nextTick` for messaging.

Immediate consistency makes it easier to write fast, non-flickering tests.

An example of how to use Neptunium is in [Reward](https://github.com/cucumber-ltd/reward) - a crowd-sourcing platform for GitHub issues. (Reward's tests implicitly test Neptunium).

Alternative implementations of messaging based on Rabbit MQ or Kafka could be implemented, allowing Neptunium apps
to run distributed (for better scalability). In this case it would be eventually consistent rather than immediately
consistent, but the semantics should remain the same as long as the flow of information is unidirectional in
applications built on the framework:

    UI -> Commands -> Aggregates -> Projectors -> Read models -> Signals -> UI