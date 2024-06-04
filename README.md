# Otterly Site

Site for [otterly js](https://github.com/LukeClancy/otterly/tree/main) documentation. Takes markdown and file names from my [otterly npm package's docs folder](https://github.com/LukeClancy/otterly/tree/main/docs) and converts it to html documentation with a menu and everything. Can be repurposed with some work for other docs.

My goal here is to get familiar with elixir/phoenix, look into technologies for quick iteration, test out otterly js, and create a good docs site for future projects. I want to work in surrealdb at some point too, but there will be some integration work there at some point as it doesn't play nice yet with phoenix.

Once again, this website is:
- a testing ground for phoenix technologies
- a testing ground for quick and effective website development
- a docs site, that should be reusable with minimal effort

Tech:
- surrealdb: Not yet implemented
- temple: Implemented, but I believe hex is a better option as hex seems quite usable, and temple is not compatible with various phoenix systems.
- bun: Quite good, super fast, still a few issues with it due to bugs. Main issue is CSS doesn't work with it yet. Thats not an issue with tailwind, but something to keep in mind. You do need custom code / settings (which I am coming to accept with bundlers) look at bundling.js
- elixir/phoenix: absolutely beautiful I never want to write ruby again. Settings are clear, documentation / syntax pops up real time, errors are obvious and mostly caught compile time. Code is clean and organized.
- Tailwind: good for quick iteration, Im not very good at css so am a bit slow still. Should probably use Chat jippity?

### refresh the UA parsers
mix ua_inspector.download
