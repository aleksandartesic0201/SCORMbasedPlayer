# == Schema Information
#
# Table name: scorm_sco_tracks
#
#  id           :bigint           not null, primary key
#  elementname  :text
#  elementvalue :text
#  sco          :bigint
#  scorm        :bigint
#  user         :bigint
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require "test_helper"

class ScormScoTrackTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
