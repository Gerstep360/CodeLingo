<?php
namespace Tests\Feature;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
class AccountSyncTest extends TestCase {
    use RefreshDatabase;
    public function test_registration_creates_hashed_password_and_session(): void {
        $this->postJson('/api/register', ['name'=>'Alumno', 'email'=>'STUDENT@example.com', 'password'=>'Correct-password-123', 'password_confirmation'=>'Correct-password-123'])->assertOk()->assertJsonPath('user.email','student@example.com')->assertJsonMissingPath('user.password');
        $this->assertTrue(Hash::check('Correct-password-123', User::first()->password));
        $this->getJson('/api/session')->assertJsonPath('user.id',User::first()->id);
        $this->withHeader('X-Account-ID', (string)User::first()->id)->postJson('/api/logout')->assertOk();
        $this->getJson('/api/progress')->assertUnauthorized();
    }
    public function test_validation_login_and_throttling(): void {
        $this->postJson('/api/register', ['name'=>'Alumno','email'=>'bad','password'=>'123','password_confirmation'=>'456'])->assertUnprocessable();
        User::factory()->create(['email'=>'student@example.com','password'=>'Correct-password-123']);
        $this->postJson('/api/login',['email'=>'student@example.com','password'=>'wrong'])->assertUnprocessable();
        $this->postJson('/api/login',['email'=>'student@example.com','password'=>'Correct-password-123'])->assertOk();
        $this->withHeader('X-Account-ID',(string)User::first()->id)->postJson('/api/logout');
        for ($i=0; $i<6; $i++) $this->postJson('/api/login',['email'=>'student@example.com','password'=>'wrong']);
        $this->postJson('/api/login',['email'=>'student@example.com','password'=>'wrong'])->assertStatus(429);
    }
    public function test_user_isolation_and_conflict_prevent_lost_updates(): void {
        $one=User::factory()->create(); $two=User::factory()->create();
        $this->withHeader('X-Account-ID',(string)$one->id)->actingAs($one)->putJson('/api/progress',['revision'=>0,'values'=>['vargas_duo_xp'=>'90']])->assertOk()->assertJsonPath('revision',1);
        $this->withHeader('X-Account-ID',(string)$two->id)->actingAs($two)->getJson('/api/progress')->assertJsonPath('revision',0)->assertJsonPath('values',[]);
        $this->withHeader('X-Account-ID',(string)$two->id)->actingAs($two)->putJson('/api/progress',['revision'=>0,'values'=>['vargas_duo_xp'=>'5'],'user_id'=>$one->id])->assertOk();
        $this->withHeader('X-Account-ID',(string)$one->id)->actingAs($one)->putJson('/api/progress',['revision'=>0,'values'=>['vargas_duo_xp'=>'10']])->assertStatus(409)->assertJsonPath('values.vargas_duo_xp','90');
        $this->getJson('/api/progress')->assertJsonPath('values.vargas_duo_xp','90');
        $this->putJson('/api/progress',['revision'=>1,'values'=>[]])->assertOk()->assertJsonPath('revision',2);
    }
    public function test_stale_tab_cannot_read_write_or_logout_another_account(): void {
        $one=User::factory()->create(); $two=User::factory()->create();
        $this->withHeader('X-Account-ID',(string)$one->id)->actingAs($two);
        $this->getJson('/api/progress')->assertForbidden();
        $this->putJson('/api/progress',['revision'=>0,'values'=>['vargas_duo_xp'=>'77']])->assertForbidden();
        $this->postJson('/api/logout')->assertForbidden();
        $this->assertDatabaseCount('user_progress',0);
    }
    public function test_whitespace_and_empty_drafts_are_preserved(): void {
        $user=User::factory()->create();$values=['vargas_code_draft_demo'=>"    int x=1;\n",'vargas_code_draft_empty'=>''];
        $this->withHeader('X-Account-ID',(string)$user->id)->actingAs($user)->putJson('/api/progress',['revision'=>0,'values'=>$values])->assertOk();
        $this->getJson('/api/progress')->assertJsonPath('values.vargas_code_draft_demo',$values['vargas_code_draft_demo'])->assertJsonPath('values.vargas_code_draft_empty','');
    }
    public function test_invalid_keys_and_oversized_payload_are_rejected(): void {
        $user=User::factory()->create(); $this->withHeader('X-Account-ID',(string)$user->id)->actingAs($user);
        $this->putJson('/api/progress',['revision'=>0,'values'=>['auth_token'=>'secret']])->assertUnprocessable();
        $this->putJson('/api/progress',['revision'=>0,'values'=>['vargas_duo_xp'=>20]])->assertUnprocessable();
        $this->putJson('/api/progress',['revision'=>0,'values'=>['vargas_code_draft_test'=>str_repeat('x',1100001)]])->assertStatus(413);
        $this->getJson('/api/progress')->assertJsonPath('revision',0);
    }
}
