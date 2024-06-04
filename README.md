# SpeedrunStack

Sets up a tech stack using linux (ubuntu), elixir, surrealdb, nginx, certbot and bun for development and deployment. Someone come up with a clever acronym. This tech stack is built for full stack developers, long term performance and quick development and deployment.

When launching a site or service, there are a million little things to do. You may be tempted to use externaly handled load balancers, servers, and databases to do these jobs for you. I would suggest you dont, and instead just install it all on a single VM. I also do not suggest using docker since its incredibly confusing and you can just use a VM. This can change if you are scaled up, but thats a different world.

## Why did I...

Alot of my tech choices can be summarized in explore vs exploit terms. When approaching tasks, there are two approaches. One is to explore for new approaches that might be more efficient. The other is to exploit a pre-known strategy that already works. Newer technologies are more and more falling into the exploit path. For example nodejs is vercitile but often inefficient as you have to plug a bunch of things together that you dont really understand. Bun, a newer approach, comes pre-configured with everything you need to serve and create javascript, css and other files on a server.

Anyway, what I am trying to bring across, is that alot of these older technologies have to support many exploratory choices that they are locked into. Instead of being weighed down by those experiments, its best to pick a more curated collection. After all what were the experiments for if not to improve?

### choose elixir/Phoenix?
To be honest I am not that familiar with elixir, I come from ruby on rails. I picked Elixir for a few reasons:
	- Pheonix is kind of new but not super new
	- Temple exists https://hexdocs.pm/temple/Temple.html which is so much better than escaping strings when writing html. I used phlex in ruby which is similar. Many would disagree, many are wrong 🤷‍. I would not pick a language that does not do this.
	- Elixir is highly scalable and speedy.
	- I dont know too much about functional languages, but Elixir has had major recommendations. With it being at the top in github surveys for developer happyness.
	- It is compilable, which means errors can be caught as you write it.
	- It has a surrealdb library, although that library is somewhat limited currently.

### choose surrealdb?
I have been working with postgresql, am quite familiar with it, and with pros and cons of "traditional" databases. Postgresql seems to be the best of the traditional databases as far as I can tell, and yet is extremely unwieldy. Based on surrealdb docs, surrealdb has a user-friendly syntax, embeddable javascript, and many nice-to-have features. Unlike most new-er databases, surrealdb is acid compliant and uses a sql-like language (surrealQL). It is also not bound to old legacy applications.

You may be tempted to use a no-sql database. Unless you have a surpluss of man hours and need to squeeze out microseconds I suggest you dont. They are unwieldy and unable to model most scenarios. Not worth having another thing floating around, and regular databases are super fast already. Use an NVME disk if you are actually running into speed issues (unlikely).

### not use websockets?
I have had bad experiences with websockets in the past where connections would randomly drop at unpredicatable times, breaking all javascript on the site. Feel free to test it out - but regular json api calls work 100% of the time, are fast, and are easy to work with. In my experience, everything that can break will. Many people using elixir pheonix use pheonix live view.

No matter what you choose, I suggest looking at a highly flexible system I made called tripwire. It covers most use-cases, is easy to learn, and is customizable if you want to add something.

### choose bun?
All-in-one frontendy-things handler. Whats not to love? (theres a lot of frontendy-things)

### nginx?
Industry standard load balancer / port handler.

### certbot?
Works with nginx. Does https things.

## commands

###




#Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `speedrun_stack` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:speedrun_stack, "~> 0.1.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at <https://hexdocs.pm/speedrun_stack>.

### refresh the UA parsers
mix ua_inspector.download