defmodule Otterly.Repo.Conv do
  @moduledoc false
  use Ecto.Schema

  schema "convs" do
    field :title, :string
    field :model_file_name, :string
    timestamps()
  end
end
