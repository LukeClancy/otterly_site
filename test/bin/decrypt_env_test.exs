defmodule Otterly.DecryptEnvTest do
  use ExUnit.Case, async: true

  @script Path.expand("../../bin/decrypt_env", __DIR__)
  @fixtures "test/fixtures/env"
  @key File.read!(Path.expand("../fixtures/env/test_only.agekey", __DIR__)) |> String.trim()

  defp decrypt(env) do
    System.cmd(@script, [env],
      env: [{"SOPS_AGE_KEY", @key}, {"ENV_DIR", @fixtures}],
      stderr_to_stdout: true
    )
  end

  test "prints shared then env-specific values, so the env file wins" do
    {out, 0} = decrypt("test")

    assert String.split(out, "\n", trim: true) == [
             "SHARED=from_shared",
             "OVERRIDE=shared",
             "OVERRIDE=test",
             ~s(QUOTED="a b")
           ]
  end

  test "fails loudly when an env file is missing" do
    {out, status} = decrypt("missing")

    assert status != 0
    assert out =~ "decrypt_env: failed to decrypt test/fixtures/env/missing.env"
  end
end
