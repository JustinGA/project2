# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131110012344) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "questions", force: true do |t|
    t.text     "question",                   null: false
    t.string   "title"
    t.string   "author",                     null: false
    t.boolean  "answered",   default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "questions_students", force: true do |t|
    t.integer "student_id",  null: false
    t.integer "question_id", null: false
  end

  create_table "students", force: true do |t|
    t.string   "name",       null: false
    t.string   "email",      null: false
    t.string   "classroom",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
