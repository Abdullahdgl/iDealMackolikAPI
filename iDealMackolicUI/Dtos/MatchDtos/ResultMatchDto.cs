namespace iDealMackolicUI.Dtos.MatchDtos
{
	public class ResultMatchDto
	{
		public int MatchId { get; set; }
		public string HomeTeam { get; set; }
		public string AwayTeam { get; set; }
		public int HomeScore { get; set; }
		public int AwayScore { get; set; }


		public DateTime MatchDate { get; set; }
		public string Stadium { get; set; }
		public int Week { get; set; }
		public string HomeLogo { get; set; }
		public string AwayLogo { get; set; }



	}
}
