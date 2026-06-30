import test from "node:test"
import assert from "node:assert/strict"
import { StoryState } from "./StoryState"

test("story tone shifts toward tension as fear and fragments build", () => {
  const state = new StoryState()

  state.gainThread("curiosity")
  state.gainThread("fear")
  state.gainPageFragment()

  assert.equal(state.getStoryTone(), "tense")
})

test("page fragments can be spent to rewrite a scene", () => {
  const state = new StoryState()

  state.gainPageFragment(2)

  assert.equal(state.spendPageFragment(), true)
  assert.equal(state.getPageFragments(), 1)
  assert.equal(state.spendPageFragment(2), false)
})
