# == Schema Information
#
# Table name: scorm_reports
#
#  id               :bigint           not null, primary key
#  completed_status :string
#  scorm            :bigint
#  total_score      :string
#  total_time       :string
#  user             :bigint
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
class ScormReport < ApplicationRecord
end
